'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Quote } from 'lucide-react'

export function TransformationSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-32">
      {/* Luminous, expansive gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900" />

      {/* Expanding light effect */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-yellow-500 to-pink-500 rounded-full blur-3xl"
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto space-y-20"
      >
        <div className="text-center space-y-8">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
            The Sages Knew It.{' '}
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Science Proves It.
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            For millennia, dreamworkers, mystics, and psychologists have understood:
            your dreams are not random. They are the language of transformation.
          </p>
        </div>

        {/* Wisdom quotes with enhanced visuals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              quote: 'Who looks outside, dreams; who looks inside, awakes.',
              author: 'Carl Jung',
              subtitle: 'Founder of Analytical Psychology',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              quote: 'Dreams are the royal road to the unconscious.',
              author: 'Sigmund Freud',
              subtitle: 'Father of Psychoanalysis',
              gradient: 'from-pink-500 to-orange-500'
            },
            {
              quote: 'The dream is a little hidden door in the innermost and most secret recesses of the soul.',
              author: 'Carl Jung',
              subtitle: 'On the Nature of Dreams',
              gradient: 'from-orange-500 to-yellow-500'
            },
            {
              quote: 'Lucid dreaming lets you make use of the dream state that comes to you every night to have a stimulating reality.',
              author: 'Stephen LaBerge',
              subtitle: 'Lucid Dreaming Pioneer',
              gradient: 'from-yellow-500 to-green-500'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`} />

              <div className="relative space-y-6">
                <Quote className={`w-12 h-12 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent opacity-50`} />

                <p className="text-xl text-white font-light leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="space-y-1">
                  <div className={`text-lg font-medium bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.author}
                  </div>
                  <div className="text-sm text-gray-400">{item.subtitle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modern research callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 max-w-4xl mx-auto"
        >
          <div className="space-y-6 text-center">
            <h3 className="text-3xl font-light text-white">Modern Research Confirms</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Recent studies in cognitive neuroscience show that REM sleep and dream processing
              are crucial for emotional regulation, memory consolidation, and creative problem-solving.
              When you work with your dreams intentionally, you&apos;re literally rewiring your brain
              for the life you want to live.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm text-gray-400">
              <span>Stickgold & Walker, 2013</span>
              <span>•</span>
              <span>Walker, 2017</span>
              <span>•</span>
              <span>Krakow et al., 2001</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
