'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mic, Square, Loader2, PlusCircle, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Profile } from '@/lib/db/types'
import { canCreateDream } from '@/lib/subscription/utils'
import Link from 'next/link'

interface DreamLogDialogProps {
  onDreamSaved?: () => void
  profile: Profile
}

export function DreamLogDialog({ onDreamSaved, profile }: DreamLogDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [canLog, setCanLog] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchDreamCount = async () => {
      try {
        const response = await fetch('/api/dreams/count')
        const data = await response.json()
        if (data.success) {
          setCanLog(canCreateDream(profile, data.count))
        }
      } catch (error) {
        console.error('Error fetching dream count:', error)
      }
    }
    fetchDreamCount()
  }, [profile, open])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        // Transcribe audio to text
        await transcribeAudio(audioBlob)
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/dreams/transcribe', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success && data.text) {
        setContent((prev) => prev + (prev ? '\n\n' : '') + data.text)
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/dreams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Untitled Dream',
          content: content.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setTitle('')
        setContent('')
        setOpen(false)
        onDreamSaved?.()
      }
    } catch (error) {
      console.error('Error saving dream:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!canLog) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Log a Dream
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-gray-800 text-center">
              Dream Limit Reached
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4 text-center">
            <div className="flex justify-center">
              <Crown className="w-16 h-16 text-purple-500" />
            </div>
            <p className="text-gray-600">
              You have reached your monthly limit of 10 dreams on the free plan.
            </p>
            <p className="text-gray-700 font-medium">
              Upgrade to Premium for unlimited dreams!
            </p>
            <Link href="/pricing">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Log a Dream
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-gray-800">
            Log Your Dream
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your dream a name..."
              className="border-purple-200 focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Dream Description</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your dream in as much detail as you remember..."
              className="min-h-48 border-purple-200 focus:border-purple-400 resize-none"
            />
          </div>

          <div className="flex flex-col items-center gap-4 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Or record your dream</p>

            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  key="recording"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center">
                      <Mic className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 animate-pulse" />
                  </motion.div>
                  <p className="text-2xl font-mono text-gray-700">{formatTime(recordingTime)}</p>
                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    size="lg"
                    className="rounded-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Square className="w-5 h-5 mr-2 fill-current" />
                    Stop Recording
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <Button
                    onClick={startRecording}
                    variant="outline"
                    size="lg"
                    className="rounded-full border-purple-300 hover:bg-purple-50"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim() || isSaving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Dream'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
