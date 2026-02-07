'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'
import { OnboardingData } from '../onboarding-flow'
import { getAdaptiveLanguage } from '@/lib/onboarding/language-adapter'

interface GeneratingStepProps {
  onNext: () => void
  data: Partial<OnboardingData>
  updateData: (data: Partial<OnboardingData>) => void
}

export function GeneratingStep({ onNext, data, updateData }: GeneratingStepProps) {
  useEffect(() => {
    // Generate ideal self using AI
    const generateIdealSelf = async () => {
      try {
        const response = await fetch('/api/onboarding/generate-ideal-self', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            age: data.age,
            qualityLoved: data.qualityLoved,
            qualityDesired: data.qualityDesired,
            idol: data.idol,
            selfie: data.selfie
          })
        })

        const result = await response.json()

        if (result.success) {
          updateData({
            idealSelfNarrative: result.narrative,
            idealSelfImage: result.imageUrl
          })

          // Wait a moment for dramatic effect
          setTimeout(() => {
            onNext()
          }, 1000)
        }
      } catch (error) {
        console.error('Error generating ideal self:', error)
        // For MVP, continue anyway with placeholder data
        setTimeout(() => {
          onNext()
        }, 2000)
      }
    }

    generateIdealSelf()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-12 p-8 min-h-[500px] flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Sparkles className="w-24 h-24 text-purple-400" />
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-4xl font-light text-gray-800">
          Creating your ideal self...
        </h2>
        <p className="text-gray-500 text-lg">
          {data.age
            ? getAdaptiveLanguage('generating-description', data.age)
            : "We're manifesting a visual representation of your ideal self. This quantum leap typically takes about 30 seconds."
          }
        </p>
      </div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex items-center gap-2 text-purple-600"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Generating...</span>
      </motion.div>
    </motion.div>
  )
}
