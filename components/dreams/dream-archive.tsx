'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Dream } from '@/lib/db/types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Calendar, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { DreamDetailDialog } from './dream-detail-dialog'

interface DreamArchiveProps {
  onRefreshRef?: React.MutableRefObject<(() => void) | null>
}

export function DreamArchive({ onRefreshRef }: DreamArchiveProps) {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null)
  const [loading, setLoading] = useState(true)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadDreams = useCallback(async () => {
    try {
      const response = await fetch('/api/dreams')
      const data = await response.json()

      if (data.success) {
        setDreams(data.dreams)
        setFilteredDreams(data.dreams)
      }
    } catch (error) {
      console.error('Error loading dreams:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Expose refresh function to parent
  useEffect(() => {
    if (onRefreshRef) {
      onRefreshRef.current = loadDreams
    }
  }, [onRefreshRef, loadDreams])

  useEffect(() => {
    loadDreams()
  }, [])

  // Poll for media status updates on dreams that are pending/processing
  useEffect(() => {
    const pendingDreams = dreams.filter(
      d => d.media_status === 'pending' || d.media_status === 'processing'
    )

    if (pendingDreams.length > 0) {
      // Poll every 5 seconds
      pollIntervalRef.current = setInterval(() => {
        loadDreams()
      }, 5000)
    } else if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [dreams, loadDreams])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const filtered = dreams.filter(
        (dream) =>
          dream.title?.toLowerCase().includes(query) ||
          dream.content.toLowerCase().includes(query) ||
          dream.themes?.some((theme) => theme.toLowerCase().includes(query)) ||
          dream.emotions?.some((emotion) => emotion.toLowerCase().includes(query))
      )
      setFilteredDreams(filtered)
    } else {
      setFilteredDreams(dreams)
    }
  }, [searchQuery, dreams])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search your dreams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 py-6 text-lg bg-white/80 backdrop-blur border-purple-200 focus:border-purple-400"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-12 h-12 text-purple-400" />
          </motion.div>
        </div>
      ) : filteredDreams.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No dreams found matching your search' : 'No dreams logged yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDreams.map((dream, index) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                layoutId={dream.id}
              >
                <Card
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  onClick={() => setSelectedDream(dream)}
                >
                  {dream.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={dream.image_url}
                        alt={dream.title || 'Dream'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-medium text-lg line-clamp-1">
                          {dream.title || 'Untitled Dream'}
                        </h3>
                      </div>
                    </div>
                  ) : dream.media_status === 'pending' || dream.media_status === 'processing' ? (
                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 className="w-10 h-10 text-purple-500 mx-auto" />
                        </motion.div>
                        <p className="text-sm text-purple-700 font-medium">
                          Generating visualization...
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <CardContent className="p-4 space-y-3">
                    {!dream.image_url && (
                      <h3 className="font-medium text-lg text-gray-800 line-clamp-1">
                        {dream.title || 'Untitled Dream'}
                      </h3>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3">{dream.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(dream.created_at), 'MMM d, yyyy')}
                    </div>
                    {dream.themes && dream.themes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {dream.themes.slice(0, 3).map((theme, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {selectedDream && (
        <DreamDetailDialog
          dream={selectedDream}
          open={!!selectedDream}
          onClose={() => setSelectedDream(null)}
        />
      )}
    </div>
  )
}
