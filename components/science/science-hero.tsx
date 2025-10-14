'use client'

import { motion } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ScienceHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-4 py-32">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950" />

      {/* Subtle animated particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full text-sm text-white border border-white/20"
        >
          <BookOpen className="w-4 h-4" />
          Research & Evidence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight"
        >
          The Science Behind{' '}
          <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
            the Journey
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Explore the peer-reviewed research, clinical studies, and psychological frameworks
          that inform our approach to dream work and manifestation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/landing">
            <Button
              variant="outline"
              className="px-8 py-6 text-lg rounded-full border-2 border-white/30 bg-white/5 hover:bg-white/20 text-white backdrop-blur"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
