'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dream, DreamAnalysis, Analyst } from '@/lib/db/types'
import { format } from 'date-fns'
import { Calendar, Sparkles, Loader2, User, ArrowLeft, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { getAnalyst } from '@/lib/analysts/profiles'
import { AnalystProfileDialog } from './analyst-profile-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DreamDetailViewProps {
  dream: Dream
  onBack: () => void
  onDelete?: () => void
}

export function DreamDetailView({ dream, onBack, onDelete }: DreamDetailViewProps) {
  const showMediaLoading = dream.media_status === 'pending' || dream.media_status === 'processing'
  const showMedia = dream.media_status === 'completed'
  const [analyses, setAnalyses] = useState<DreamAnalysis[]>([])
  const [loadingAnalyses, setLoadingAnalyses] = useState(true)
  const [selectedAnalyst, setSelectedAnalyst] = useState<Analyst | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (dream.id) {
      loadAnalyses()
    }
  }, [dream.id])

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

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/dreams/${dream.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete dream')
      }

      setShowDeleteDialog(false)
      onDelete?.()
      onBack()
    } catch (error) {
      console.error('Error deleting dream:', error)
      alert('Failed to delete dream. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50"
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dreams
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Dream
          </Button>
        </div>

        <motion.div
          layoutId={dream.id}
          className="space-y-8"
        >
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-light text-gray-800">
              {dream.title || 'Untitled Dream'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {format(new Date(dream.created_at), 'MMMM d, yyyy')}
            </div>
          </div>

          {/* Video - Priority display */}
          {showMedia && dream.video_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
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

          {/* Image - Fallback if no video */}
          {showMedia && dream.image_url && !dream.video_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={dream.image_url}
                alt={dream.title || 'Dream visualization'}
                className="w-full h-auto"
              />
            </motion.div>
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
                This usually takes 2-5 minutes. You can go back and check later!
              </p>
            </motion.div>
          )}

          {/* Dream Content */}
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Your Dream
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
              {dream.content}
            </p>
          </div>

          {/* Analyst Interpretations Tabs */}
          {!loadingAnalyses && analyses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-gray-800">Dream Analyses</h3>
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
                      <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-2xl font-medium text-purple-900">
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
                        <div className="prose prose-lg max-w-none">
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
            <div className="space-y-4 bg-purple-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-medium text-purple-900">Quick Interpretation</h3>
              <p className="text-purple-800 leading-relaxed text-lg">{dream.interpretation}</p>
            </div>
          )}

          {/* Tags Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {dream.themes && dream.themes.length > 0 && (
              <div className="space-y-3 bg-white rounded-2xl p-6 shadow-lg">
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
              <div className="space-y-3 bg-white rounded-2xl p-6 shadow-lg">
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
        </motion.div>
      </div>

      {/* Analyst Profile Modal */}
      <AnalystProfileDialog
        analyst={selectedAnalyst}
        open={!!selectedAnalyst}
        onClose={() => setSelectedAnalyst(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this dream?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your dream and all associated analyses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Dream'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
