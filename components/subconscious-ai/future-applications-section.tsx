'use client'

import { motion } from 'framer-motion'
import { Brain, Lightbulb, Compass, Shield, Sparkles, TrendingUp } from 'lucide-react'

export function FutureApplicationsSection() {
  const applications = [
    {
      icon: Lightbulb,
      title: "Creative Decision-Making",
      description: "AI assistants that understand not just what you consciously want, but what your subconscious patterns suggest you need—making recommendations aligned with your deeper self."
    },
    {
      icon: Compass,
      title: "Subconscious Navigation",
      description: "Personal guidance systems trained on your dream patterns, emotional rhythms, and symbolic language—navigation that speaks to your inner compass, not just logical goals."
    },
    {
      icon: TrendingUp,
      title: "Predictive Insight",
      description: "Early warning systems for stress, burnout, or misalignment by detecting subconscious signals before they manifest consciously—your dreams as predictive health data."
    },
    {
      icon: Shield,
      title: "Therapeutic AI",
      description: "Mental health tools that understand your unique symbolic language and can facilitate integration work, Shadow exploration, and trauma processing in collaboration with human therapists."
    }
  ]

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
            The Future of{' '}
            <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Subconscious AI
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're building the first infrastructure for subconscious-aware AI systems.
            The next generation of tools won't just respond to what you consciously request—they'll
            understand what your deeper self actually needs.
          </p>
        </motion.div>

        {/* The Paradigm Shift */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 to-purple-600/30 rounded-3xl blur-3xl group-hover:blur-[100px] transition-all duration-700" />
          <div className="relative bg-black/80 backdrop-blur border border-pink-500/30 rounded-3xl p-12 hover:border-pink-400/60 transition-all duration-500">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-light text-white mb-4">The Paradigm Shift</h3>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  Current AI systems operate exclusively on conscious data: what you say, write, search for, click on.
                  They model the surface of human behavior. But consciousness is just the tip of the iceberg.
                </p>
                <p className="text-xl text-gray-300 leading-relaxed">
                  We're creating AI trained on subconscious data—dreams, symbolic patterns, emotional undercurrents,
                  archetypal resonances. This isn't just better personalization. It's a fundamentally different class
                  of intelligence: AI that sees the 90% of you that lives below the waterline.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-medium text-pink-300 mb-3">Conscious-Only AI</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Responds to explicit requests and stated preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Trained on behavioral data, clicks, searches, text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Optimizes for what you consciously think you want</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Limited by surface-level pattern matching</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-medium text-purple-300 mb-3">Subconscious-Aware AI</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Understands implicit needs, hidden patterns, symbolic language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Trained on dreams, emotions, archetypal patterns, manifestations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Aligns with what your deeper self actually requires for growth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />
                    <span>Accesses the full depth of human psychological experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Future Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {applications.map((app, index) => {
            const Icon = app.icon
            return (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-black/60 backdrop-blur border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-4">{app.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{app.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl group-hover:blur-[100px] transition-all duration-700" />
          <div className="relative bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur border border-blue-500/30 rounded-3xl p-12 text-center">
            <Sparkles className="w-12 h-12 text-blue-300 mx-auto mb-6" />
            <h3 className="text-3xl font-light text-white mb-6">
              Beyond Personalization: Human Augmentation
            </h3>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-6">
              The endgame isn't just better recommendations or smarter assistants. It's AI that helps you
              become more fully yourself—integrating the fragmented parts of your psyche, illuminating
              blind spots, facilitating the individuation process that Jung described.
            </p>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Imagine an AI copilot that knows your Shadow, recognizes your archetypal patterns, and can
              guide you toward psychological integration. That's not science fiction. It's the logical
              conclusion of training AI on the complete dataset of human consciousness—both conscious and
              subconscious dimensions.
            </p>
          </div>
        </motion.div>

        {/* Ethical Considerations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur border border-purple-500/30 rounded-3xl p-8 text-center"
        >
          <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
            <span className="text-purple-300 font-medium">Built on Privacy:</span> All subconscious data
            remains private to you. We're not building a panopticon—we're building a mirror. Your dreams,
            patterns, and insights power AI that serves only you, never training on or sharing your
            deepest psychological data. This is human augmentation, not surveillance capitalism.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
