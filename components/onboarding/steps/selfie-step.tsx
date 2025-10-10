'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Camera, Upload } from 'lucide-react'
import { OnboardingData } from '../onboarding-flow'

interface SelfieStepProps {
  onNext: () => void
  onBack: () => void
  data: Partial<OnboardingData>
  updateData: (data: Partial<OnboardingData>) => void
}

export function SelfieStep({ onNext, onBack, data, updateData }: SelfieStepProps) {
  const [preview, setPreview] = useState<string | null>(data.selfie || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        updateData({ selfie: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSkip = () => {
    updateData({ selfie: null })
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-12 p-8"
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-light text-gray-800">
          Take a selfie
        </h2>
        <p className="text-gray-500 text-lg">
          This helps us create a visual representation of your ideal self
        </p>
      </div>

      <div className="space-y-8">
        {preview ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mx-auto w-64 h-64 rounded-full overflow-hidden border-4 border-purple-200"
          >
            <img
              src={preview}
              alt="Selfie preview"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="mx-auto w-64 h-64 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-dashed border-purple-300">
            <Camera className="w-16 h-16 text-purple-400" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="lg"
            className="px-12 py-6 text-lg rounded-full border-purple-300"
          >
            <Upload className="w-5 h-5 mr-2" />
            {preview ? 'Change Photo' : 'Upload Photo'}
          </Button>

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
            {preview ? (
              <Button
                onClick={onNext}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-lg rounded-full"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="lg"
                className="px-12 py-6 text-lg rounded-full"
              >
                Skip for now
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
