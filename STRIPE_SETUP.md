# Stripe Subscription Setup Guide

This document outlines everything needed to implement Stripe subscriptions for Rêve.

## Current State

✅ **Database Ready**: The `profiles` table already has all necessary subscription fields:
- `subscription_tier`: 'free' | 'premium'
- `subscription_status`: 'active' | 'inactive' | 'cancelled' | 'trialing'
- `trial_ends_at`: TIMESTAMP
- `subscription_ends_at`: TIMESTAMP
- `stripe_customer_id`: TEXT (unique)
- `stripe_subscription_id`: TEXT (unique)

✅ **Stripe SDK Installed**: `stripe` package already in dependencies

## Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to https://stripe.com and sign up
2. Complete business verification
3. Switch to Test mode during development

### 1.2 Create Products & Prices
In Stripe Dashboard → Products:

**Free Tier** (optional explicit product)
- Name: "Rêve Free"
- Price: $0/month
- Features: Basic dream logging, limited dreams

**Premium Tier**
- Name: "Rêve Premium"
- Price: $9.99/month (or your chosen price)
- Features: Unlimited dreams, AI chat, analyst perspectives, video generation
- Optional: Add annual plan ($99/year - 17% discount)

### 1.3 Get API Keys
Stripe Dashboard → Developers → API Keys:
- Publishable key: `pk_test_...` (later `pk_live_...`)
- Secret key: `sk_test_...` (later `sk_live_...`)

### 1.4 Set Up Webhook
Stripe Dashboard → Developers → Webhooks:
- Endpoint URL: `https://your-domain.com/api/stripe/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Copy webhook signing secret: `whsec_...`

## Step 2: Environment Variables

Add to `.env.local` (development) and Vercel (production):

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (from Products page)
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_... # optional
```

## Step 3: Code Implementation

### 3.1 Stripe Client Initialization

Create `lib/stripe/client.ts`:

```typescript
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia', // Use latest version
  typescript: true,
})
```

### 3.2 API Routes to Create

#### `/app/api/stripe/create-checkout-session/route.ts`
**Purpose**: Create Stripe Checkout session for subscription purchase

```typescript
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await request.json()

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      metadata: {
        user_id: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

#### `/app/api/stripe/webhook/route.ts`
**Purpose**: Handle Stripe webhook events to sync subscription status

```typescript
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (session.mode === 'subscription' && userId) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'premium',
              subscription_status: 'active',
              stripe_subscription_id: subscription.id,
              subscription_ends_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
              subscription_ends_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', profile.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'free',
              subscription_status: 'cancelled',
              stripe_subscription_id: null,
              subscription_ends_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', profile.id)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'inactive',
            })
            .eq('id', profile.id)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
```

#### `/app/api/stripe/create-portal-session/route.ts`
**Purpose**: Create Stripe Customer Portal session for managing subscription

```typescript
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

### 3.3 Frontend Components

#### Pricing Section Component
Create `components/pricing/pricing-section.tsx`:

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PricingSection() {
  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Tier */}
      <div className="border rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-2">Free</h3>
        <p className="text-4xl font-bold mb-6">$0<span className="text-lg">/month</span></p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>10 dreams per month</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Basic AI interpretation</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Dream images</span>
          </li>
        </ul>
        <Button variant="outline" className="w-full">Current Plan</Button>
      </div>

      {/* Premium Tier */}
      <div className="border-2 border-purple-500 rounded-3xl p-8 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
          Popular
        </div>
        <h3 className="text-2xl font-bold mb-2">Premium</h3>
        <p className="text-4xl font-bold mb-6">$9.99<span className="text-lg">/month</span></p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-purple-500" />
            <span>Unlimited dreams</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-purple-500" />
            <span>Jung & Freud analyst perspectives</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-purple-500" />
            <span>Dream videos</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-purple-500" />
            <span>AI subconscious chat</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-purple-500" />
            <span>Unlimited manifestations</span>
          </li>
        </ul>
        <Button onClick={handleUpgrade} className="w-full bg-purple-500 hover:bg-purple-600">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  )
}
```

#### Subscription Status Component
Add to profile view:

```typescript
'use client'

import { Button } from '@/components/ui/button'

export function SubscriptionStatus({ profile }: { profile: Profile }) {
  const handleManageSubscription = async () => {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
    })
    const { url } = await response.json()
    window.location.href = url
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">Subscription</h3>
      <p className="text-gray-600 mb-4">
        Current plan: <span className="font-semibold capitalize">{profile.subscription_tier}</span>
      </p>
      {profile.subscription_tier === 'premium' && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Status: {profile.subscription_status}
            {profile.subscription_ends_at && (
              <> • Renews {new Date(profile.subscription_ends_at).toLocaleDateString()}</>
            )}
          </p>
          <Button onClick={handleManageSubscription} variant="outline">
            Manage Subscription
          </Button>
        </>
      )}
    </div>
  )
}
```

### 3.4 Feature Gating

#### Subscription Helper
Create `lib/subscription/utils.ts`:

```typescript
import { Profile } from '@/lib/db/types'

export function isPremium(profile: Profile | null): boolean {
  if (!profile) return false
  return (
    profile.subscription_tier === 'premium' &&
    profile.subscription_status === 'active'
  )
}

export function canCreateDream(profile: Profile | null, dreamCount: number): boolean {
  if (isPremium(profile)) return true
  return dreamCount < 10 // Free tier limit
}

export function canAccessSubconsciousChat(profile: Profile | null): boolean {
  return isPremium(profile)
}

export function canAccessAnalystPerspectives(profile: Profile | null): boolean {
  return isPremium(profile)
}
```

#### Apply Gating in Components
- Dream creation: Check `canCreateDream()` before allowing
- Subconscious tab: Show upgrade prompt if `!canAccessSubconsciousChat()`
- Analyst tabs: Hide Jung/Freud if `!canAccessAnalystPerspectives()`

## Step 4: Testing

### Test Mode Flow
1. Use Stripe test cards: `4242 4242 4242 4242` (any CVC, future date)
2. Test subscription creation via checkout
3. Verify webhook events in Stripe Dashboard → Developers → Webhooks
4. Test subscription cancellation via Customer Portal
5. Test failed payment with test card: `4000 0000 0000 0341`

### Webhook Testing Locally
Use Stripe CLI:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Use the webhook signing secret from CLI output in .env.local
```

## Step 5: Production Deployment

1. Switch Stripe account to Live mode
2. Get live API keys (`pk_live_...`, `sk_live_...`)
3. Update environment variables in Vercel
4. Update webhook endpoint URL to production domain
5. Test with real card (small amount)
6. Set up billing alerts in Stripe

## Step 6: Optional Enhancements

- **Free trial**: Add 7-day trial to premium subscription
- **Annual discount**: Offer 17% discount for yearly plan
- **Usage-based billing**: Charge per dream after certain threshold
- **Promo codes**: Create discount codes in Stripe
- **Email notifications**: Send subscription confirmation/expiry emails

## Feature Limits Reference

| Feature | Free | Premium |
|---------|------|---------|
| Dreams per month | 10 | Unlimited |
| Dream images | ✅ | ✅ |
| Dream videos | ❌ | ✅ |
| AI interpretation | Basic | Advanced |
| Analyst perspectives | ❌ | ✅ (Jung, Freud) |
| Subconscious chat | ❌ | ✅ |
| Manifestations | 3 seeds | Unlimited |
| Voice logging | ✅ | ✅ |

---

**Estimated Implementation Time**: 4-6 hours

**Resources**:
- Stripe Docs: https://stripe.com/docs/billing/subscriptions/overview
- Stripe Webhooks: https://stripe.com/docs/webhooks
- Next.js Stripe Example: https://github.com/vercel/nextjs-subscription-payments
