'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles } from 'lucide-react'

export function BridgeSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-32">
      {/* Transitional gradient - from dark to light */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900" />

      {/* Flowing energy particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [1000, -100],
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          className="absolute w-2 h-2 bg-purple-400 rounded-full blur-sm"
          style={{
            left: `${10 + (i * 3)}%`,
            bottom: 0,
          }}
        />
      ))}

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-6xl mx-auto space-y-16"
      >
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur px-6 py-3 rounded-full text-sm text-purple-200 border border-purple-400/30"
          >
            <Sparkles className="w-4 h-4" />
            The Science of Transformation
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
            Your Dreams Are the{' '}
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Bridge
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Between who you are and who you&apos;re destined to become. Every night, your subconscious
            processes your deepest desires, fears, and possibilities—creating a roadmap for transformation.
          </p>
        </div>

        {/* Science-backed stats with visual impact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              stat: '70%',
              label: 'Success Rate',
              description: 'Image Rehearsal Therapy has a 70% success rate in reshaping nightmares and transforming thought patterns',
              citation: 'Krakow et al., 2001',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              stat: '20-45%',
              label: 'Symptom Reduction',
              description: 'Significant reduction in anxiety and depression symptoms through dream work and visualization',
              citation: 'Journal of Traumatic Stress, 2018',
              gradient: 'from-pink-500 to-blue-500'
            },
            {
              stat: '90%',
              label: 'Dream Recall',
              description: 'Of dreams occur during REM sleep—your mind&apos;s most creative and transformative state',
              citation: 'Stickgold & Walker, 2013',
              gradient: 'from-blue-500 to-purple-500'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`} />

              <div className="relative space-y-4">
                <div className={`text-6xl font-light bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                  {item.stat}
                </div>
                <div className="text-lg font-medium text-white">{item.label}</div>
                <div className="text-sm text-gray-300 leading-relaxed">{item.description}</div>
                <div className="text-xs text-gray-500 italic pt-2">{item.citation}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            This isn&apos;t wishful thinking. This is neuroscience, psychology, and ancient wisdom
            converging into a proven pathway for change.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
