'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

export default function CompleteOnboardingPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        // Get onboarding data from sessionStorage
        const onboardingDataStr = sessionStorage.getItem('onboarding_data')

        if (!onboardingDataStr) {
          console.error('No onboarding data found')
          setStatus('error')
          setTimeout(() => router.push('/onboarding'), 2000)
          return
        }

        const onboardingData = JSON.parse(onboardingDataStr)

        // Complete the onboarding by creating the profile
        const response = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(onboardingData)
        })

        const result = await response.json()

        if (result.success) {
          // Clear the stored data
          sessionStorage.removeItem('onboarding_data')

          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          console.error('Failed to complete onboarding:', result.error)
          setStatus('error')
          setTimeout(() => router.push('/onboarding'), 2000)
        }
      } catch (error) {
        console.error('Error completing onboarding:', error)
        setStatus('error')
        setTimeout(() => router.push('/onboarding'), 2000)
      }
    }

    completeOnboarding()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="text-center space-y-8">
        {status === 'loading' ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Sparkles className="w-20 h-20 text-purple-400" />
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-3xl font-light text-gray-800">
                Setting up your journey...
              </h2>
              <p className="text-gray-600">
                Creating your profile and generating your first manifestations
              </p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center gap-2 text-purple-600"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Please wait...</span>
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <div className="text-red-500 text-6xl">⚠️</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-light text-gray-800">
                Something went wrong
              </h2>
              <p className="text-gray-600">
                Redirecting you back to onboarding...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
