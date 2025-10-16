'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dream, DreamAnalysis, Analyst } from '@/lib/db/types'
import { format } from 'date-fns'
import { Calendar, Sparkles, Loader2, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { getAnalyst } from '@/lib/analysts/profiles'
import { AnalystProfileDialog } from './analyst-profile-dialog'

interface DreamDetailDialogProps {
  dream: Dream
  open: boolean
  onClose: () => void
}

export function DreamDetailDialog({ dream, open, onClose }: DreamDetailDialogProps) {
  const showMediaLoading = dream.media_status === 'pending' || dream.media_status === 'processing'
  const showMedia = dream.media_status === 'completed'
  const [analyses, setAnalyses] = useState<DreamAnalysis[]>([])
  const [loadingAnalyses, setLoadingAnalyses] = useState(true)
  const [selectedAnalyst, setSelectedAnalyst] = useState<Analyst | null>(null)

  useEffect(() => {
    if (open && dream.id) {
      loadAnalyses()
    }
  }, [open, dream.id])

  const loadAnalyses = async () => {
    try {
      setLoadingAnalyses(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('dream_analyses')
        .select('*')
        .eq('dream_id', dream.id)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setAnalyses(data)
      }
    } catch (error) {
      console.error('Error loading analyses:', error)
    } finally {
      setLoadingAnalyses(false)
    }
  }

  const handleAnalystClick = (analystId: string) => {
    const analyst = getAnalyst(analystId)
    if (analyst) {
      setSelectedAnalyst(analyst)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-light text-gray-800">
            {dream.title || 'Untitled Dream'}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(dream.created_at), 'MMMM d, yyyy')}
          </div>
        </DialogHeader>

        <div className="space-y-8 pt-4">
          {/* Media Section */}
          {showMedia && (dream.video_url || dream.image_url) && (
            <div className="space-y-4">
              {/* Video */}
              {dream.video_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                >
                  <video
                    src={dream.video_url}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-auto"
                  >
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              )}

              {/* Image */}
              {dream.image_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                >
                  <img
                    src={dream.image_url}
                    alt={dream.title || 'Dream visualization'}
                    className="w-full h-auto"
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* Loading state */}
          {showMediaLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 min-h-[300px]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-12 h-12 text-purple-500" />
              </motion.div>
              <p className="text-purple-700 font-medium text-lg">Generating your dream visualization...</p>
              <p className="text-sm text-purple-600 text-center max-w-md">
                This usually takes 2-5 minutes. You can close this and check back later!
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Your Dream
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {dream.content}
            </p>
          </div>

          {/* Analyst Interpretations Tabs */}
          {!loadingAnalyses && analyses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Dream Analyses</h3>
              <Tabs defaultValue={analyses[0]?.analyst_id || 'jung'} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  {analyses.map((analysis) => {
                    const analyst = getAnalyst(analysis.analyst_id)
                    return (
                      <TabsTrigger key={analysis.analyst_id} value={analysis.analyst_id}>
                        {analyst?.name || analysis.analyst_id}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                {analyses.map((analysis) => {
                  const analyst = getAnalyst(analysis.analyst_id)
                  return (
                    <TabsContent key={analysis.analyst_id} value={analysis.analyst_id}>
                      <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-medium text-purple-900">
                              {analyst?.name}
                            </h4>
                            <p className="text-sm text-purple-600">{analyst?.title}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAnalystClick(analysis.analyst_id)}
                            className="text-purple-700 border-purple-300 hover:bg-purple-100"
                          >
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {analysis.analysis}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </div>
          )}

          {loadingAnalyses && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          )}

          {dream.interpretation && (
            <div className="space-y-4 bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-purple-900">Quick Interpretation</h3>
              <p className="text-purple-800 leading-relaxed">{dream.interpretation}</p>
            </div>
          )}

          {dream.themes && dream.themes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {dream.themes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dream.emotions && dream.emotions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Emotions
              </h3>
              <div className="flex flex-wrap gap-2">
                {dream.emotions.map((emotion, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Analyst Profile Modal */}
      <AnalystProfileDialog
        analyst={selectedAnalyst}
        open={!!selectedAnalyst}
        onClose={() => setSelectedAnalyst(null)}
      />
    </Dialog>
  )
}
