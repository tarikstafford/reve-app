'use client'

import { useState, useEffect } from 'react'
import { Profile } from '@/lib/db/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Sparkles, Crown, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export function ProfileView() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-12 h-12 text-purple-400" />
        </motion.div>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center py-20 text-gray-500">Profile not found</div>
  }

  const isTrialing = profile.subscription_status === 'trialing'
  const isPremium = profile.subscription_tier === 'premium'
  const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <CardContent className="relative -mt-20 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
              <AvatarImage src={profile.selfie_url || undefined} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h2 className="text-3xl font-light text-gray-800">{profile.name}</h2>
                {isPremium ? (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                ) : isTrialing ? (
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    Free Trial
                  </Badge>
                ) : (
                  <Badge variant="outline">Free</Badge>
                )}
              </div>
              {profile.age && (
                <p className="text-gray-600">Age: {profile.age}</p>
              )}
            </div>

            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {profile.ideal_self_narrative && (
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-light">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Your Ideal Self
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.ideal_self_image_url && (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={profile.ideal_self_image_url}
                  alt="Your ideal self"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            <p className="text-gray-700 leading-relaxed italic">
              {profile.ideal_self_narrative}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg font-light">Qualities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.quality_loved && (
              <div>
                <p className="text-sm text-gray-500 mb-1">What you love about yourself</p>
                <p className="text-gray-800">{profile.quality_loved}</p>
              </div>
            )}
            {profile.quality_desired && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Quality you&apos;re developing</p>
                <p className="text-gray-800">{profile.quality_desired}</p>
              </div>
            )}
            {profile.idol_name && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Inspiration</p>
                <p className="text-gray-800">{profile.idol_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg font-light">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Plan</p>
              <p className="text-gray-800 capitalize">{profile.subscription_tier}</p>
            </div>
            {isTrialing && trialEndsAt && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Trial Ends</p>
                <p className="text-gray-800">{format(trialEndsAt, 'MMMM d, yyyy')}</p>
              </div>
            )}
            {!isPremium && (
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
