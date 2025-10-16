'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function TrappedSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-32">
      {/* Dark, confined atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />

      {/* Subtle cage-like pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            #fff 0px,
            transparent 1px,
            transparent 40px
          ),
          repeating-linear-gradient(
            90deg,
            #fff 0px,
            transparent 1px,
            transparent 40px
          )`
        }}
      />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto space-y-12"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-100 leading-tight text-center"
        >
          Most People Live in a{' '}
          <span className="text-gray-400 italic">Cage of Their Own Making</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <video
              src="/landing/dream-landing.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-6 text-xl text-gray-300 leading-relaxed"
          >
            <p>
              They wake up every day trapped in patterns they never chose. Repeating the same thoughts.
              Making the same choices. Living the same life.
            </p>
            <p>
              Their dreams try to show them the way out, but they dismiss them as random noise.
              Their intuition whispers of possibilities, but fear keeps them frozen.
            </p>
            <p className="text-2xl text-gray-100 font-light pt-4">
              They don&apos;t realize: <span className="text-purple-300">the key to freedom has been with them all along.</span>
            </p>
          </motion.div>
        </div>

        {/* Subtle breaking chains visual */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex justify-center gap-4 pt-8"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scaleY: [1, 0.8, 1],
                opacity: [0.4, 0.2, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1 h-16 bg-gray-600 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
