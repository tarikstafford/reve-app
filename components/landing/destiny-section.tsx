'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function DestinySection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-32">
      {/* Cosmic, infinite gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950" />

      {/* Multiple cosmic layers */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-full"
      >
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-6xl mx-auto text-center space-y-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-light text-white leading-tight">
            The Universe You Dream Of{' '}
            <span className="block mt-4 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Is Waiting
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed font-light">
              You&apos;ve felt it, haven&apos;t you? That pull toward something greater.
              That knowing that you&apos;re meant for more than the patterns you&apos;ve been living.
            </p>

            <p className="text-xl text-gray-300 leading-relaxed">
              Your dreams have been trying to show you the way. Your intuition has been whispering.
              Your ideal self has been waiting on the other side of the bridge.
            </p>

            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-2xl text-purple-200 font-light pt-6"
            >
              It&apos;s time to cross.
            </motion.div>
          </div>
        </motion.div>

        {/* Transformation promise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto"
        >
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-300" />
              <h3 className="text-3xl font-light text-white">What Awaits You</h3>
              <Sparkles className="w-8 h-8 text-pink-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {[
                'A daily practice that transforms nightmares into wisdom',
                'Clear patterns emerging from your subconscious mind',
                'A visual library of your dream world and manifestations',
                'Evidence-based techniques proven to reshape your reality',
                'An AI companion trained to understand your unique journey',
                'A community of dreamers who are also crossing their bridges',
              ].map((promise, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                  <p className="text-gray-200 leading-relaxed">{promise}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your destiny isn&apos;t something you wait for. It&apos;s something you cultivate,
            dream by dream, intention by intention, choice by choice.
          </p>

          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-16 py-8 text-2xl rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all group"
            >
              Begin Your Journey
              <ArrowRight className="w-8 h-8 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>

          <p className="text-sm text-gray-500">
            Free to start. Your transformation begins tonight.
          </p>
        </motion.div>

        {/* Ethereal closing visual */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex justify-center gap-2 pt-12"
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scaleY: [0.5, 1.5, 0.5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className={`w-1 h-12 rounded-full bg-gradient-to-t ${
                i % 3 === 0 ? 'from-purple-400 to-pink-400' :
                i % 3 === 1 ? 'from-pink-400 to-blue-400' :
                'from-blue-400 to-purple-400'
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
