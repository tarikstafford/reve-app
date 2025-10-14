'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WelcomeStep } from './steps/welcome-step'
import { NameStep } from './steps/name-step'
import { AgeStep } from './steps/age-step'
import { QualityLovedStep } from './steps/quality-loved-step'
import { QualityDesiredStep } from './steps/quality-desired-step'
import { IdolStep } from './steps/idol-step'
import { SelfieStep } from './steps/selfie-step'
import { GeneratingStep } from './steps/generating-step'
import { IdealSelfStep } from './steps/ideal-self-step'

export interface OnboardingData {
  name: string
  age: number
  qualityLoved: string
  qualityDesired: string
  idol: string
  selfie: string | null
  idealSelfNarrative?: string
  idealSelfImage?: string
}

const steps = [
  'welcome',
  'name',
  'age',
  'quality-loved',
  'quality-desired',
  'idol',
  'selfie',
  'generating',
  'ideal-self'
] as const

export function OnboardingFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<Partial<OnboardingData>>({})
  const [, setDirection] = useState(0)

  const currentStep = steps[currentStepIndex]

  const next = () => {
    setDirection(1)
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const previous = () => {
    setDirection(-1)
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const updateData = (newData: Partial<OnboardingData>) => {
    setData({ ...data, ...newData })
  }

  const slideVariants = {
    enter: {
      y: 20,
      opacity: 0,
      scale: 0.98
    },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1
    },
    exit: {
      zIndex: 0,
      y: -20,
      opacity: 0,
      scale: 0.98
    }
  }

  const renderStep = () => {
    const stepProps = {
      onNext: next,
      onBack: previous,
      data,
      updateData
    }

    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep {...stepProps} />
      case 'name':
        return <NameStep {...stepProps} />
      case 'age':
        return <AgeStep {...stepProps} />
      case 'quality-loved':
        return <QualityLovedStep {...stepProps} />
      case 'quality-desired':
        return <QualityDesiredStep {...stepProps} />
      case 'idol':
        return <IdolStep {...stepProps} />
      case 'selfie':
        return <SelfieStep {...stepProps} />
      case 'generating':
        return <GeneratingStep {...stepProps} />
      case 'ideal-self':
        return <IdealSelfStep {...stepProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentStep}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="w-full max-w-2xl"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
