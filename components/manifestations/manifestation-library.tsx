'use client'

import { useState, useEffect } from 'react'
import { Manifestation } from '@/lib/db/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Volume2, Sparkles, RefreshCw, Info, X, Brain, Moon, Waves, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ManifestationDetailDialog } from './manifestation-detail-dialog'
import { CreateManifestationDialog } from './create-manifestation-dialog'

export function ManifestationLibrary() {
  const [manifestations, setManifestations] = useState<Manifestation[]>([])
  const [selectedManifestation, setSelectedManifestation] = useState<Manifestation | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    loadManifestations()
  }, [])

  const loadManifestations = async () => {
    try {
      const response = await fetch('/api/manifestations')
      const data = await response.json()

      if (data.success) {
        setManifestations(data.manifestations)
      }
    } catch (error) {
      console.error('Error loading manifestations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (manifestation: Manifestation) => {
    setSelectedManifestation(manifestation)
  }

  const handleGenerateSeeds = async () => {
    try {
      setGenerating(true)
      const response = await fetch('/api/manifestations/generate-seeds-for-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to generate manifestations')
      }

      // Reload manifestations after generation
      await loadManifestations()
    } catch (error) {
      console.error('Error generating seed manifestations:', error)
      alert('Failed to generate manifestations. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Button - Shows when manifestations exist */}
      {manifestations.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Manifestation
          </Button>
        </div>
      )}

      {/* IRT Usage Guide */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-purple-900">
                      How to Use Image Rehearsal Therapy
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGuide(false)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4 text-gray-700">
                  <p className="text-sm leading-relaxed">
                    Image Rehearsal Therapy (IRT) is a powerful technique for manifestation that works by reprogramming your subconscious mind during the theta state—that liminal space between wakefulness and sleep.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Moon className="w-5 h-5" />
                        <h4 className="font-semibold">1. Timing is Key</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Play your manifestation story as you&apos;re falling asleep. This is when your brain enters the theta state, making your subconscious most receptive to new patterns.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Waves className="w-5 h-5" />
                        <h4 className="font-semibold">2. Enter Theta State</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        As you drift off, your brainwaves slow from beta (alert) to alpha (relaxed) to theta (drowsy). In theta, the barrier between conscious and subconscious dissolves.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Sparkles className="w-5 h-5" />
                        <h4 className="font-semibold">3. Rehearse & Rewire</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        By repeatedly hearing your ideal narrative in this state, you&apos;re rehearsing a new reality. Your brain can&apos;t distinguish imagination from experience—it rewires accordingly.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-medium text-purple-900 mb-2">💡 Best Practices:</p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Use headphones or speakers at a comfortable volume</li>
                      <li>Practice consistently—nightly repetition builds neural pathways</li>
                      <li>Don&apos;t force it; let the story wash over you as you drift</li>
                      <li>Trust the process; changes happen beneath conscious awareness</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Toggle Button */}
      {!showGuide && manifestations.length > 0 && (
        <Button
          variant="outline"
          onClick={() => setShowGuide(true)}
          className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <Info className="w-4 h-4 mr-2" />
          How to Use Image Rehearsal Therapy
        </Button>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-12 h-12 text-purple-400" />
          </motion.div>
        </div>
      ) : manifestations.length === 0 ? (
        <div className="text-center py-20">
          <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No manifestations yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Generate your personalized seed manifestations to begin your journey
          </p>
          <Button
            onClick={handleGenerateSeeds}
            disabled={generating}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Seed Manifestations
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {manifestations.map((manifestation, index) => (
              <motion.div
                key={manifestation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {manifestation.image_url && (
                    <div className="relative h-56 overflow-hidden">
                      <motion.img
                        src={manifestation.image_url}
                        alt={manifestation.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handlePlay(manifestation)}
                          size="lg"
                          className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-purple-600 shadow-xl"
                        >
                          <Play className="w-6 h-6 ml-1" fill="currentColor" />
                        </Button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-medium text-xl">
                          {manifestation.title}
                        </h3>
                        {manifestation.is_seed && (
                          <span className="inline-block mt-2 px-3 py-1 bg-purple-500/80 backdrop-blur text-white text-xs rounded-full">
                            Seed Manifestation
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {manifestation.narrative}
                    </p>
                    {manifestation.tags && manifestation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {manifestation.tags.slice(0, 4).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Volume2 className="w-4 h-4" />
                        Played {manifestation.play_count} times
                      </div>
                      <Button
                        onClick={() => handlePlay(manifestation)}
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {selectedManifestation && (
        <ManifestationDetailDialog
          manifestation={selectedManifestation}
          open={!!selectedManifestation}
          onClose={() => setSelectedManifestation(null)}
          onPlayCountUpdate={loadManifestations}
        />
      )}

      <CreateManifestationDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={loadManifestations}
      />
    </div>
  )
}
