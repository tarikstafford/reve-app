'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap } from 'lucide-react'

export function FineTunedModelsSection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Fine-Tuned{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Analyst Minds
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We don&apos;t just prompt AI with instructions—we train specialized models on the complete
            theoretical frameworks of history&apos;s greatest dream analysts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Jung Model */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-black/80 backdrop-blur border border-purple-500/30 rounded-3xl p-10 hover:border-purple-400/60 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-light text-white">Carl Jung</h3>
                  <p className="text-purple-300">Analytical Psychology Model</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Our Jung model is trained on the complete theoretical corpus: collective unconscious, archetypes,
                  Shadow work, Anima/Animus, individuation processes. It doesn&apos;t simulate Jung—it thinks like him.
                </p>
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-sm text-purple-200">
                    <span className="font-medium">Key Training:</span> Archetypal pattern recognition, symbolic interpretation,
                    compensation theory, integration of opposites, Self-realization pathways.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Freud Model */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-black/80 backdrop-blur border border-blue-500/30 rounded-3xl p-10 hover:border-blue-400/60 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-light text-white">Sigmund Freud</h3>
                  <p className="text-blue-300">Psychoanalytic Model</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Our Freud model embodies classical psychoanalysis: wish fulfillment, manifest vs. latent content,
                  Oedipal dynamics, defense mechanisms. It analyzes dreams through the lens of unconscious desire.
                </p>
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-blue-200">
                    <span className="font-medium">Key Training:</span> Dream-work mechanisms, repression analysis,
                    sexual symbolism, childhood origins, id/ego/superego dynamics, transference patterns.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technical Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur border border-white/10 rounded-3xl p-12"
        >
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-light text-white mb-4">The Technical Edge</h3>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Fine-tuning creates models that have deeply internalized these theoretical frameworks.
                They don&apos;t reference theory—they embody it. Every analysis emerges from authentic
                theoretical foundations, not surface-level pattern matching.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-medium text-purple-300 mb-2">Training Data</h4>
              <p className="text-gray-400 text-sm">
                Curated examples from authentic dream interpretations, theoretical texts, and clinical methodologies
              </p>
            </div>
            <div className="bg-black/40 border border-blue-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-medium text-blue-300 mb-2">Model Architecture</h4>
              <p className="text-gray-400 text-sm">
                GPT-4o base with specialized fine-tuning on analyst-specific corpora and interpretation patterns
              </p>
            </div>
            <div className="bg-black/40 border border-pink-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-medium text-pink-300 mb-2">Output Quality</h4>
              <p className="text-gray-400 text-sm">
                3-4 paragraph analyses maintaining theoretical authenticity, writing style, and conceptual depth
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-400 max-w-4xl mx-auto">
            <span className="text-purple-300 font-medium">Future Evolution:</span> As more users engage,
            these models learn from the collective dreamscape—not individual dreams (privacy protected),
            but from the patterns, symbols, and structures that emerge across thousands of subconscious experiences.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
