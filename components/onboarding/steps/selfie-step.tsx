'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Camera, Upload, X } from 'lucide-react'
import { OnboardingData } from '../onboarding-flow'
import { getAdaptiveLanguage } from '@/lib/onboarding/language-adapter'

interface SelfieStepProps {
  onNext: () => void
  onBack: () => void
  data: Partial<OnboardingData>
  updateData: (data: Partial<OnboardingData>) => void
}

export function SelfieStep({ onNext, onBack, data, updateData }: SelfieStepProps) {
  const [preview, setPreview] = useState<string | null>(data.selfie || null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      setStream(mediaStream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Could not access camera. Please check permissions or upload a photo instead.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setPreview(imageData)
        updateData({ selfie: imageData })
        stopCamera()
      }
    }
  }

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
          {data.age
            ? getAdaptiveLanguage('selfie-description', data.age)
            : "This helps us create a visual representation of your ideal self"
          }
        </p>
      </div>

      <div className="space-y-8">
        {showCamera ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mx-auto w-full max-w-md"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-2xl border-4 border-purple-200 shadow-xl"
            />
            <Button
              onClick={stopCamera}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </motion.div>
        ) : preview ? (
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

        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col gap-4">
          {showCamera ? (
            <Button
              type="button"
              onClick={capturePhoto}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-lg rounded-full"
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture Photo
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={startCamera}
                variant="outline"
                size="lg"
                className="px-12 py-6 text-lg rounded-full border-purple-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                {preview ? 'Retake with Camera' : 'Take Photo'}
              </Button>
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
            </>
          )}

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
