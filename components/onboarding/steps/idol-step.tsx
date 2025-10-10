'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OnboardingData } from '../onboarding-flow'

interface IdolStepProps {
  onNext: () => void
  onBack: () => void
  data: Partial<OnboardingData>
  updateData: (data: Partial<OnboardingData>) => void
}

export function IdolStep({ onNext, onBack, data, updateData }: IdolStepProps) {
  const [idol, setIdol] = useState(data.idol || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (idol.trim()) {
      updateData({ idol: idol.trim() })
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-12 p-8"
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-light text-gray-800">
          Who is one person you idolize?
        </h2>
        <p className="text-gray-500 text-lg">
          Someone who inspires you to be better
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Input
          type="text"
          value={idol}
          onChange={(e) => setIdol(e.target.value)}
          placeholder="Their name"
          className="text-center text-2xl py-8 bg-white/80 backdrop-blur border-purple-200 focus:border-purple-400 transition-colors"
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
            disabled={!idol.trim()}
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
