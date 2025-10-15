'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Analyst } from '@/lib/db/types'
import { Badge } from '@/components/ui/badge'
import { Brain, Calendar, Sparkles } from 'lucide-react'

interface AnalystProfileDialogProps {
  analyst: Analyst | null
  open: boolean
  onClose: () => void
}

export function AnalystProfileDialog({ analyst, open, onClose }: AnalystProfileDialogProps) {
  if (!analyst) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-light">
              {analyst.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-light">{analyst.name}</DialogTitle>
              <p className="text-gray-600 text-lg mt-1">{analyst.title}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Info */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="px-3 py-1">
              <Calendar className="w-3 h-3 mr-1" />
              {analyst.era}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Brain className="w-3 h-3 mr-1" />
              {analyst.specialty}
            </Badge>
          </div>

          {/* Approach */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Analytical Approach
            </h3>
            <p className="text-gray-700 leading-relaxed">{analyst.approach}</p>
          </div>

          {/* Biography */}
          <div>
            <h3 className="text-lg font-medium mb-2">Biography & Key Concepts</h3>
            <div className="prose prose-sm max-w-none">
              {analyst.bio.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
