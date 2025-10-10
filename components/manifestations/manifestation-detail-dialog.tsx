'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Manifestation } from '@/lib/db/types'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

interface ManifestationDetailDialogProps {
  manifestation: Manifestation
  open: boolean
  onClose: () => void
  onPlayCountUpdate?: () => void
}

export function ManifestationDetailDialog({
  manifestation,
  open,
  onClose,
  onPlayCountUpdate
}: ManifestationDetailDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (open) {
      // Increment play count
      incrementPlayCount()
    }

    return () => {
      stopPlayback()
    }
  }, [open])

  const incrementPlayCount = async () => {
    try {
      await fetch(`/api/manifestations/${manifestation.id}/play`, {
        method: 'POST'
      })
      onPlayCountUpdate?.()
    } catch (error) {
      console.error('Error incrementing play count:', error)
    }
  }

  const startPlayback = () => {
    if (manifestation.audio_url) {
      // Use recorded audio if available
      if (!audioRef.current) {
        audioRef.current = new Audio(manifestation.audio_url)
        audioRef.current.addEventListener('ended', () => setIsPlaying(false))
        audioRef.current.addEventListener('timeupdate', () => {
          if (audioRef.current) {
            const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100
            setProgress(percent)
          }
        })
      }
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      // Use text-to-speech fallback
      const utterance = new SpeechSynthesisUtterance(manifestation.narrative)
      utterance.rate = 0.8 // Slower, more calming pace
      utterance.pitch = 1.0
      utterance.volume = isMuted ? 0 : 1

      // Try to use a calm female voice
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.includes('Female') || voice.name.includes('Samantha')
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setProgress(100)
      }

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)

      // Simulate progress for speech synthesis
      const duration = manifestation.narrative.length * 50 // Rough estimate
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + (100 / (duration / 100))
        })
      }, 100)
    }
  }

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel()
    }

    setIsPlaying(false)
    setProgress(0)
  }

  const togglePlayback = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      } else {
        window.speechSynthesis.pause()
      }
      setIsPlaying(false)
    } else {
      if (audioRef.current && audioRef.current.currentTime > 0) {
        audioRef.current.play()
        setIsPlaying(true)
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
        setIsPlaying(true)
      } else {
        startPlayback()
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {manifestation.image_url && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={manifestation.image_url}
                alt={manifestation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-light text-white text-center mb-8"
                >
                  {manifestation.title}
                </motion.h2>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={togglePlayback}
                    size="lg"
                    className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-purple-600 shadow-2xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-8">
              <p className="text-lg text-gray-800 leading-relaxed text-center italic">
                {manifestation.narrative}
              </p>
            </div>

            <div className="text-center text-sm text-gray-500">
              Close your eyes, breathe deeply, and let these words guide you
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
