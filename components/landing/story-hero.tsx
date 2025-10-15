'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, LogIn, User } from 'lucide-react'
import Link from 'next/link'
import { signInWithGoogle } from '@/lib/auth/auth-helpers'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function StoryHero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Top Bar with Profile Icon */}
      {isLoggedIn && (
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="max-w-7xl mx-auto flex justify-end">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 border border-white/20"
              >
                <User className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Animated background with cosmic theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />

        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 1, 0.2],
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

        {/* Nebula effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full text-sm text-white border border-white/20"
          >
            <Sparkles className="w-4 h-4" />
            Your destiny is not written in the stars—it&apos;s written in your dreams
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
            You Stand at the{' '}
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Edge of Change
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Every night, your subconscious whispers secrets about who you could become.
            Most people ignore these messages. But you&apos;re here because you sense something more—a bridge between
            the life you&apos;re living and the universe you&apos;re meant to create.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all group"
            >
              Cross the Bridge
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="px-12 py-8 text-xl rounded-full border-2 border-white/30 bg-white/5 hover:bg-white/20 text-white group backdrop-blur"
            onClick={signInWithGoogle}
          >
            <LogIn className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
            Sign In
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.5 },
            y: { duration: 2, repeat: Infinity }
          }}
          className="pt-16"
        >
          <div className="text-white/60 text-sm mb-4">Begin your journey</div>
          <ArrowRight className="w-6 h-6 mx-auto text-white/60 rotate-90" />
        </motion.div>
      </div>
    </section>
  )
}
