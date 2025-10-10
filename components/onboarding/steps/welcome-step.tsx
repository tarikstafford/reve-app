'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 p-8"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className="inline-block"
      >
        <Sparkles className="w-20 h-20 text-purple-400 mx-auto" />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-5xl font-light text-gray-800 tracking-wide">
          Welcome to <span className="font-normal text-purple-600">Rêve</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
          A space to explore your subconscious, understand your dreams, and create the life you desire
        </p>
      </div>

      <div className="space-y-4 pt-8">
        <p className="text-sm text-gray-500">
          Your dreams and data are encrypted and private, accessible only to you
        </p>
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Begin Your Journey
        </Button>
      </div>
    </motion.div>
  )
}
