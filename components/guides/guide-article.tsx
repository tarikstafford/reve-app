'use client'

import { motion } from 'framer-motion'
import { Guide } from '@/lib/guides/content'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface GuideArticleProps {
  guide: Guide
}

export function GuideArticle({ guide }: GuideArticleProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              {guide.title}
            </h1>
            <p className="text-xl text-gray-400 mb-6 leading-relaxed">
              {guide.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(guide.publishedAt), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {guide.readTime}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-invert prose-lg max-w-none">
            {guide.content.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-light text-white mb-4 border-l-4 border-purple-500 pl-4">
                  {section.heading}
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  {section.content.split('\n\n').map((paragraph, pIndex) => {
                    // Handle bold markdown
                    const parts = paragraph.split(/(\*\*.*?\*\*)/)
                    return (
                      <p key={pIndex} className="whitespace-pre-wrap">
                        {parts.map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={i} className="text-white font-semibold">
                                {part.slice(2, -2)}
                              </strong>
                            )
                          }
                          return part
                        })}
                      </p>
                    )
                  })}
                </div>
              </motion.section>
            ))}
          </div>

          {/* CTA Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-purple-500/20"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-light text-white mb-4">
                Ready to transform your reality?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Start your journey with Rêve. Log your dreams, create manifestations, and unlock
                your subconscious potential.
              </p>
              <Link
                href="/onboarding"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Related Guides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <Link
              href="/landing#guides"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              ← View All Guides
            </Link>
          </motion.div>
        </motion.div>
      </article>
    </div>
  )
}
