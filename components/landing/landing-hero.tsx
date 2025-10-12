'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, LogIn } from 'lucide-react'
import Link from 'next/link'
import { signInWithGoogle } from '@/lib/auth/auth-helpers'

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-blue-100/50" />

        {/* Floating orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-purple-400 rounded-full blur-sm"
            style={{
              left: `${10 + (i * 6)}%`,
              bottom: '10%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm text-purple-700 border border-purple-200"
        >
          <Sparkles className="w-4 h-4" />
          Evidence-Based Dream Work & Manifestation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900"
        >
          Unlock the Power of Your{' '}
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Subconscious
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
        >
          Transform your dreams into insights and your aspirations into reality with AI-powered dream
          interpretation, Image Rehearsal Therapy, and science-backed manifestation practices.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
        >
          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg rounded-full border-2 border-purple-300 hover:bg-purple-50 group"
            onClick={signInWithGoogle}
          >
            <LogIn className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Sign In
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { stat: '70%', label: 'Success rate with Image Rehearsal Therapy', gradient: 'from-purple-500 to-pink-500' },
            { stat: '20-45%', label: 'Reduction in anxiety & depression', gradient: 'from-pink-500 to-blue-500' },
            { stat: '90%', label: 'Dream recall rate from REM sleep', gradient: 'from-blue-500 to-purple-500' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + i * 0.1 }}
              className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-purple-200/50 shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <div className={`text-5xl font-light bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-3`}>
                  {item.stat}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
