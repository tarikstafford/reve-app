'use client'

import { motion } from 'framer-motion'
import { Guide } from '@/lib/guides/content'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Sparkles, Moon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface GuidesIndexProps {
  guides: Guide[]
}

const iconMap = {
  'image-rehearsal-therapy': Sparkles,
  'dream-logging': BookOpen,
  'dream-interpretation': Moon,
}

const colorMap = {
  'image-rehearsal-therapy': 'purple',
  'dream-logging': 'pink',
  'dream-interpretation': 'blue',
}

export function GuidesIndex({ guides }: GuidesIndexProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full text-sm text-purple-300 mb-6">
            <BookOpen className="w-4 h-4" />
            Learn & Explore
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6">
            Practical{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Guides
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to unlock the power of your dreams and transform your reality.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, index) => {
            const Icon = iconMap[guide.slug as keyof typeof iconMap] || BookOpen
            const color = colorMap[guide.slug as keyof typeof colorMap] || 'purple'

            return (
              <motion.div
                key={guide.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/guides/${guide.slug}`}>
                  <Card className="h-full bg-white/5 backdrop-blur border-purple-500/20 hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/0 to-${color}-500/0 group-hover:from-${color}-500/10 group-hover:to-${color}-500/20 transition-all duration-300`} />

                    <CardContent className="p-8 space-y-6 relative">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-400 to-${color}-500 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity -z-10`} />
                      </motion.div>

                      <div>
                        <h3 className="text-2xl font-medium text-white group-hover:text-purple-300 transition-colors mb-3">
                          {guide.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                          {guide.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-purple-400">{guide.readTime}</span>
                          <span className="text-sm text-purple-400 group-hover:translate-x-1 transition-transform">
                            Read guide →
                          </span>
                        </div>
                      </div>

                      <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-${color}-500/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
