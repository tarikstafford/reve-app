'use client'

import { motion } from 'framer-motion'
import { Image, Video, Waveform, Palette } from 'lucide-react'

export function VisualMappingSection() {
  const features = [
    {
      icon: Image,
      title: "AI-Generated Imagery",
      description: "Every dream is transformed into a visual representation using advanced image generation models. We analyze your dream content and create surrealist imagery that captures the emotional and symbolic essence of your subconscious experience."
    },
    {
      icon: Video,
      title: "Dynamic Visualizations",
      description: "Dreams aren't static—they flow and transform. Our AI generates video sequences that bring your dreams to life, creating moving visualizations that mirror the fluid nature of subconscious processing."
    },
    {
      icon: Waveform,
      title: "Voice-to-Dream Pipeline",
      description: "Speak your dreams naturally using Whisper AI transcription. Your voice carries emotional data—tone, pace, pauses—that our systems preserve and analyze, capturing nuances that text alone cannot convey."
    },
    {
      icon: Palette,
      title: "Manifestation Visuals",
      description: "Your ideal self-narrative becomes a living image. We generate personalized visual representations of your manifestations, creating concrete anchors for abstract aspirations through AI-powered visualization."
    }
  ]

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Visual Mapping of the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Invisible
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your subconscious speaks in symbols, emotions, and imagery. We use AI to translate
            these signals into visual forms that your conscious mind can process and understand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-black/60 backdrop-blur border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur border border-purple-500/30 rounded-3xl p-12 text-center"
        >
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            <span className="text-purple-300 font-medium">The Innovation:</span> Traditional dream analysis relies on memory and language.
            We skip that lossy translation. Our AI operates directly on the symbolic, visual, and emotional registers
            of your subconscious—creating a more authentic map of your inner world.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
