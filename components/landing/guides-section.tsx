'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Sparkles, Moon } from 'lucide-react'
import Link from 'next/link'

const guides = [
  {
    slug: 'image-rehearsal-therapy',
    title: 'How to Practice Image Rehearsal Therapy',
    description: 'Learn the evidence-based technique for transforming nightmares and manifesting your ideal self through visualization.',
    icon: Sparkles,
    color: 'purple',
    readTime: '5 min read'
  },
  {
    slug: 'dream-logging',
    title: 'The Art of Dream Journaling',
    description: 'Master the practice of capturing dreams effectively. Techniques to improve recall and extract meaningful insights.',
    icon: BookOpen,
    color: 'pink',
    readTime: '4 min read'
  },
  {
    slug: 'dream-interpretation',
    title: 'Understanding Your Dreams',
    description: 'Decode the symbols and patterns in your dreams. How AI analysis reveals your subconscious patterns.',
    icon: Moon,
    color: 'blue',
    readTime: '6 min read'
  }
]

export function GuidesSection() {
  return (
    <section id="guides" className="py-24 px-4 bg-gradient-to-b from-black to-purple-950/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full text-sm text-purple-300 mb-6">
            <BookOpen className="w-4 h-4" />
            Learn & Explore
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Practical{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Guides
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to unlock the power of your dreams and transform your reality.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/guides/${guide.slug}`}>
                <Card className="h-full bg-white/5 backdrop-blur border-purple-500/20 hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300 group overflow-hidden relative cursor-pointer">
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${guide.color}-500/0 to-${guide.color}-500/0 group-hover:from-${guide.color}-500/10 group-hover:to-${guide.color}-500/20 transition-all duration-300`} />

                  <CardContent className="p-8 space-y-6 relative">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${guide.color}-500 to-${guide.color}-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <guide.icon className="w-7 h-7 text-white" />
                      </div>
                      {/* Decorative glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-${guide.color}-400 to-${guide.color}-500 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity -z-10`} />
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

                    {/* Decorative corner element */}
                    <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-${guide.color}-500/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
