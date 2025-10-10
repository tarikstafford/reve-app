'use client'

import { useState, useEffect } from 'react'
import { Manifestation } from '@/lib/db/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ManifestationDetailDialog } from './manifestation-detail-dialog'

export function ManifestationLibrary() {
  const [manifestations, setManifestations] = useState<Manifestation[]>([])
  const [selectedManifestation, setSelectedManifestation] = useState<Manifestation | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="space-y-6">
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
          <p className="text-gray-500 text-lg">No manifestations yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Your first manifestations will be created after onboarding
          </p>
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
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {manifestation.narrative}
                    </p>
                    <div className="flex items-center justify-between">
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
    </div>
  )
}
