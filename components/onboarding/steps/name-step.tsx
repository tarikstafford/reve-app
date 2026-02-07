'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OnboardingData } from '../onboarding-flow'
import { getAdaptiveLanguage } from '@/lib/onboarding/language-adapter'

interface NameStepProps {
  onNext: () => void
  data: Partial<OnboardingData>
  updateData: (data: Partial<OnboardingData>) => void
}

export function NameStep({ onNext, data, updateData }: NameStepProps) {
  const [name, setName] = useState(data.name || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      updateData({ name: name.trim() })
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
          What is your name?
        </h2>
        <p className="text-purple-600 text-lg leading-relaxed">
          {data.age
            ? getAdaptiveLanguage('name-description', data.age)
            : "We're here to help you understand the universe you're creating"
          }
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="text-center text-2xl py-8 bg-white/80 backdrop-blur border-purple-200 focus:border-purple-400 transition-colors"
          autoFocus
        />

        <Button
          type="submit"
          disabled={!name.trim()}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-lg rounded-full disabled:opacity-50"
        >
          Continue
        </Button>
      </form>
    </motion.div>
  )
}
