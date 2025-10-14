'use client'

import { motion } from 'framer-motion'
import { Users, Heart, Compass } from 'lucide-react'

export function DisclaimerSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="w-8 h-8 text-purple-300" />
            <h2 className="text-3xl md:text-4xl font-light text-white text-center">
              A Space for Collective Exploration
            </h2>
            <Heart className="w-8 h-8 text-pink-300" />
          </div>

          <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
            <p className="text-center text-xl text-purple-200 font-light">
              Rêve is about shared discovery, not definitive answers.
            </p>

            <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent my-8" />

            <p>
              We do not claim to know the full extent to which dream exploration, Image Rehearsal Therapy,
              or manifestation practices can result in positive change. What we do know is that there are
              <span className="text-purple-300 font-medium"> compelling clues </span>
              in the research—evidence that suggests these practices can be transformative.
            </p>

            <p>
              The science we reference represents the current state of understanding, but the field of
              dream research, consciousness studies, and therapeutic interventions is
              <span className="text-pink-300 font-medium"> constantly evolving</span>.
              New discoveries are being made. Old assumptions are being challenged.
            </p>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 my-8 border border-white/10">
              <div className="flex items-start gap-4">
                <Compass className="w-12 h-12 text-yellow-300 flex-shrink-0 mt-1" />
                <div className="space-y-4">
                  <p className="text-white font-light text-xl">
                    This is a space for shared growth.
                  </p>
                  <p>
                    Every dream you log, every pattern you notice, every insight you gain contributes to our
                    collective understanding. You are not just using a tool—you are participating in an ongoing
                    exploration of human consciousness, potential, and transformation.
                  </p>
                </div>
              </div>
            </div>

            <p>
              We encourage you to approach this journey with
              <span className="text-blue-300 font-medium"> curiosity and openness</span>,
              while maintaining a healthy balance of optimism and critical thinking. The research below
              provides a foundation, but your own experience will be the ultimate guide.
            </p>

            <p className="text-center text-purple-200 italic pt-6">
              Together, we&apos;re discovering what&apos;s possible when we pay attention to our dreams.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
