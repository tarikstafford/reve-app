'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PricingSection() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
        }),
      })

      const data = await response.json()

      if (data.sessionId) {
        const stripe = await stripePromise
        if (stripe) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await (stripe as any).redirectToCheckout({ sessionId: data.sessionId })
          if (error) {
            console.error('Redirect error:', error)
          }
        }
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setLoading(false)
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
        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
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
        <Button
          onClick={handleUpgrade}
          className="w-full bg-purple-500 hover:bg-purple-600"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Upgrade to Premium'}
        </Button>
      </div>
    </div>
  )
}
