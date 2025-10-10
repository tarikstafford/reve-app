'use client'

import { motion } from 'framer-motion'
import { Moon, Sparkles, MessageCircle, Brain, Palette, Mic } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Moon,
    title: 'Dream Logging',
    description: 'Capture your dreams through text or voice. Our AI transcribes and preserves every detail of your nocturnal journeys.',
    benefit: 'Reduces depression & anxiety by 20-45%',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Brain,
    title: 'AI Dream Interpretation',
    description: 'GPT-4 powered analysis reveals themes, emotions, and patterns in your dreams, helping you understand your subconscious mind.',
    benefit: 'Activates prefrontal cortex while calming amygdala',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: Palette,
    title: 'Dream Visualization',
    description: 'DALL-E 3 transforms your dreams into stunning surrealist art, creating a visual archive of your subconscious imagery.',
    benefit: 'Enhances memory consolidation by 90%',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Sparkles,
    title: 'Dream Manifestation',
    description: 'Based on Image Rehearsal Therapy, reimagine your dreams with positive narratives and reinforcement through audio playback.',
    benefit: 'Level A treatment with 70% success rate',
    color: 'from-violet-500 to-violet-600'
  },
  {
    icon: MessageCircle,
    title: 'Subconscious Dialogue',
    description: 'After 10 dreams, unlock conversations with your subconscious. AI creates a personalized model based on your dream history.',
    benefit: 'Strengthens neural pathways through repetition',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: Mic,
    title: 'Voice Recording',
    description: 'Capture dreams immediately upon waking with voice notes. Whisper AI transcribes them perfectly for later analysis.',
    benefit: 'Maximizes recall during critical REM window',
    color: 'from-fuchsia-500 to-fuchsia-600'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Your Complete Dream{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Companion
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature is grounded in peer-reviewed research and designed to help you explore,
            understand, and transform your inner world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-xl border-purple-200/50 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 group overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardContent className="p-8 space-y-4 relative">
                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    {/* Decorative elements */}
                    <div className={`absolute -top-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity`} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="pt-4 border-t border-purple-100">
                    <div className="flex items-start gap-2">
                      <div className={`mt-1 w-5 h-5 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{feature.benefit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
