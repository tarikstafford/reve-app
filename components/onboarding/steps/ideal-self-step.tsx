'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { OnboardingData } from '../onboarding-flow'
import { signInWithGoogle } from '@/lib/auth/auth-helpers'

interface IdealSelfStepProps {
  data: Partial<OnboardingData>
}

export function IdealSelfStep({ data }: IdealSelfStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Store onboarding data in sessionStorage to complete after auth
      sessionStorage.setItem('onboarding_data', JSON.stringify(data))

      // Initiate Google OAuth
      await signInWithGoogle()

      // User will be redirected to Google, then back to /auth/callback
      // The callback will complete the profile creation
    } catch (error) {
      console.error('Error signing in with Google:', error)
      setError('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-12 p-8"
    >
      <div className="space-y-6">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-light text-gray-800"
        >
          Your Ideal Self
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg"
        >
          Meet the person you're becoming, {data.name}
        </motion.p>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="space-y-8"
      >
        {data.idealSelfImage && (
          <div className="relative mx-auto w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={data.idealSelfImage}
              alt="Your ideal self"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
        >
          <p className="text-lg text-gray-700 leading-relaxed italic">
            {data.idealSelfNarrative ||
              `You are ${data.name}, embodying ${data.qualityLoved} while growing into ${data.qualityDesired}. Inspired by ${data.idol}, you're becoming the person you've always dreamed of being.`
            }
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleComplete}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-16 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting with Google...
            </>
          ) : (
            'Sign in with Google to Begin'
          )}
        </Button>

        <p className="text-xs text-gray-500 max-w-md mx-auto">
          By continuing, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and private.
        </p>
      </motion.div>
    </motion.div>
  )
}
