'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Sparkles, Mic, ImageIcon, MessageSquare, BookOpen } from 'lucide-react'

export function ToolSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-32">
      {/* Empowering gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900" />

      {/* Radiant energy center */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto space-y-20"
      >
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full text-sm text-white border border-white/20"
          >
            <Brain className="w-4 h-4" />
            Powered by AI & Ancient Wisdom
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
            This Is Your{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Compass
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Rêve is not just an app—it&apos;s your guide across the bridge of transformation.
            A tool that empowers you to decode your dreams, reprogram your patterns, and
            cultivate the universe you&apos;ve always known was possible.
          </p>
        </div>

        {/* Feature cards with empowering language */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Mic,
              title: 'Capture Your Dreams',
              description: 'Wake up and speak. Our AI transcribes your dreams instantly, preserving every detail before they fade.',
              gradient: 'from-purple-500 to-pink-500',
              stat: 'Voice & Text',
            },
            {
              icon: Brain,
              title: 'Decode the Messages',
              description: 'GPT-4 powered interpretation reveals the hidden meanings, patterns, and guidance within your subconscious.',
              gradient: 'from-pink-500 to-red-500',
              stat: 'AI Analysis',
            },
            {
              icon: ImageIcon,
              title: 'Visualize Your Dreams',
              description: 'Transform abstract dreams into vivid images. See what your subconscious is showing you.',
              gradient: 'from-red-500 to-orange-500',
              stat: 'DALL-E 3',
            },
            {
              icon: Sparkles,
              title: 'Reprogram Your Reality',
              description: 'Image Rehearsal Therapy lets you reshape nightmares and reinforce positive visions with audio playback.',
              gradient: 'from-orange-500 to-yellow-500',
              stat: '70% Success',
            },
            {
              icon: MessageSquare,
              title: 'Converse with Your Depths',
              description: 'After 10 dreams, unlock the Subconscious Chat—a dialogue with the deeper parts of yourself.',
              gradient: 'from-yellow-500 to-green-500',
              stat: 'Unlock at 10',
            },
            {
              icon: BookOpen,
              title: 'Track Your Transformation',
              description: 'Watch your patterns emerge over time. Your dream archive becomes a map of your evolution.',
              gradient: 'from-green-500 to-blue-500',
              stat: 'Full Archive',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all group hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`} />

              <div className="relative space-y-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <div className="text-xs text-gray-400 uppercase tracking-wider">{feature.stat}</div>

                <h3 className="text-2xl font-light text-white">{feature.title}</h3>

                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center space-y-6"
        >
          <p className="text-3xl text-white font-light max-w-4xl mx-auto leading-relaxed">
            Every feature is designed with one purpose:{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              to empower you to cross that bridge.
            </span>
          </p>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From the life you&apos;re living to the universe you&apos;re meant to create.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
