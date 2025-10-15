'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Link2, TrendingUp, Sparkles } from 'lucide-react'

export function AIChatSection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-950/20 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Chat with Your{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Subconscious
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            After logging 10 dreams, unlock AI-powered dialogue with your own subconscious mind.
            This isn&apos;t a chatbot—it&apos;s a mirror that reflects patterns you haven&apos;t noticed.
          </p>
        </motion.div>

        {/* Main Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 to-purple-600/30 rounded-3xl blur-3xl group-hover:blur-[100px] transition-all duration-700" />
          <div className="relative bg-black/80 backdrop-blur border border-pink-500/30 rounded-3xl p-12 hover:border-pink-400/60 transition-all duration-500">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-light text-white mb-4">Conversational Depth</h3>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Ask questions. Explore recurring symbols. Investigate emotional patterns. The AI has analyzed
                  every dream you&apos;ve logged, every manifestation you&apos;ve created, every theme and emotion you&apos;ve
                  experienced. It sees the connections your conscious mind misses.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-pink-900/20 border border-pink-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-medium text-pink-300 mb-3">Example Questions</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>&quot;Why do I keep dreaming about water when I&apos;m stressed?&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>&quot;What patterns appear in my dreams before major decisions?&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>&quot;How have my subconscious themes evolved over time?&quot;</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-medium text-purple-300 mb-3">What It Knows</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Every dream you&apos;ve logged and their interpretations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Recurring themes, emotions, and symbolic patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Your manifestations and ideal self-narrative</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Temporal patterns and contextual correlations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Connection Engine */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-black/60 backdrop-blur border border-white/10 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-500 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Link2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-4">Pattern Recognition</h3>
              <p className="text-gray-400 leading-relaxed">
                The AI identifies connections between dreams, emotions, and life events that you might not
                consciously recognize—bridging the gap between isolated experiences.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-black/60 backdrop-blur border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-4">Temporal Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                Track how your subconscious themes evolve over weeks and months. See the narrative arc
                of your inner journey as patterns shift and resolve.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-black/60 backdrop-blur border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-4">Context Integration</h3>
              <p className="text-gray-400 leading-relaxed">
                Your subconscious doesn&apos;t exist in isolation. The AI connects dream content with your
                manifestations, creating a holistic understanding of your psyche.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 backdrop-blur border border-pink-500/30 rounded-3xl p-8 text-center"
        >
          <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
            <span className="text-pink-300 font-medium">Privacy First:</span> Your subconscious chat is
            entirely private. The AI analyzes only your own dreams, never comparing you to others or
            sharing your data. This is your personal mirror, not a surveillance system.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
