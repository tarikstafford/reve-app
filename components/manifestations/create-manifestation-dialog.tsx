'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Loader2 } from 'lucide-react'

interface CreateManifestationDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateManifestationDialog({
  open,
  onClose,
  onSuccess
}: CreateManifestationDialogProps) {
  const [dreamContext, setDreamContext] = useState('')
  const [theme, setTheme] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!dreamContext.trim() || !theme.trim()) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/manifestations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dreamContext: dreamContext.trim(),
          theme: theme.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create manifestation')
      }

      // Reset form and close
      setDreamContext('')
      setTheme('')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating manifestation:', error)
      alert('Failed to create manifestation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Create Your Manifestation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium text-purple-900 mb-2">How this works:</p>
            <p>
              Describe a challenging dream or situation you want to transform. We&apos;ll create a powerful
              Image Rehearsal Therapy narrative where you overcome this challenge and embody your ideal self.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dreamContext" className="text-base">
              Dream or Situation
            </Label>
            <Textarea
              id="dreamContext"
              placeholder="Example: I had a dream where I went to a party but felt like an outsider. Everyone was talking and laughing, but I couldn't connect with anyone..."
              value={dreamContext}
              onChange={(e) => setDreamContext(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Describe the challenging dream or situation you want to transform
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme" className="text-base">
              Theme
            </Label>
            <Input
              id="theme"
              placeholder="e.g., social confidence, self-worth, courage, peace"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              What quality or feeling do you want to embody?
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!dreamContext.trim() || !theme.trim() || loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Manifestation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
