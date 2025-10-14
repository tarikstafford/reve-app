'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { OnboardingData } from '../onboarding-flow'

interface QualityDesiredStepProps {
  onNext: () => void
  onBack: () => void
  data: Partial<OnboardingData>
  updateData: (data: Partial<OnboardingData>) => void
}

export function QualityDesiredStep({ onNext, onBack, data, updateData }: QualityDesiredStepProps) {
  const [quality, setQuality] = useState(data.qualityDesired || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (quality.trim()) {
      updateData({ qualityDesired: quality.trim() })
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-12 p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-4xl font-light text-gray-800">
          What is one quality you wish you had?
        </h2>
        <p className="text-purple-600 text-lg leading-relaxed max-w-2xl mx-auto">
          This is the bridge to your future self. By naming what you desire, you begin to cultivate it. The universe responds to clear intention.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Textarea
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          placeholder="I wish I had..."
          className="text-center text-xl min-h-32 bg-white/80 backdrop-blur border-purple-200 focus:border-purple-400 transition-colors resize-none"
          autoFocus
        />

        <div className="flex gap-4 justify-center">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            size="lg"
            className="px-12 py-6 text-lg rounded-full"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!quality.trim()}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-lg rounded-full disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
