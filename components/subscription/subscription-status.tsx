'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Profile } from '@/lib/db/types'
import { useState } from 'react'
import { Crown } from 'lucide-react'
import Link from 'next/link'

export function SubscriptionStatus({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)

  const handleManageSubscription = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-light">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Current Plan</p>
          <p className="text-gray-800 capitalize font-semibold">{profile.subscription_tier}</p>
        </div>
        {profile.subscription_tier === 'premium' && (
          <>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="text-gray-800 capitalize">{profile.subscription_status}</p>
            </div>
            {profile.subscription_ends_at && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Renews</p>
                <p className="text-gray-800">{new Date(profile.subscription_ends_at).toLocaleDateString()}</p>
              </div>
            )}
            <Button onClick={handleManageSubscription} variant="outline" disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Manage Subscription'}
            </Button>
          </>
        )}
        {profile.subscription_tier === 'free' && (
          <Link href="/pricing">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
