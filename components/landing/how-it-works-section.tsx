'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { User, Moon, Brain, Sparkles, MessageCircle, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: User,
    number: '01',
    title: 'Create Your Ideal Self',
    description: 'Begin with our guided onboarding. Answer reflective questions about who you are and who you aspire to become. Our AI generates a beautiful visualization of your ideal self—a north star for your journey.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Moon,
    number: '02',
    title: 'Log Your Dreams',
    description: 'Capture dreams the moment you wake using text or voice. Our Whisper AI transcribes perfectly, preserving every detail. GPT-4 analyzes themes, emotions, and patterns while DALL-E creates surrealist visualizations.',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: Brain,
    number: '03',
    title: 'Understand Your Patterns',
    description: 'Browse your dream archive with powerful search. Filter by themes, emotions, and dates. Watch patterns emerge as your subconscious reveals itself through recurring symbols and narratives.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Sparkles,
    number: '04',
    title: 'Manifest Positive Change',
    description: 'Transform dreams using Image Rehearsal Therapy. Our AI creates empowering narratives with audio playback. Listen daily to rewire neural pathways and replace negative patterns with positive ones.',
    color: 'from-violet-500 to-violet-600'
  },
  {
    icon: MessageCircle,
    number: '05',
    title: 'Dialogue with Your Subconscious',
    description: 'After 10 dreams, unlock conversations with your subconscious. Our AI builds a personalized model based on your dream history, creating a unique dialogue partner for self-discovery.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: TrendingUp,
    number: '06',
    title: 'Track Your Growth',
    description: 'Watch your journey unfold. See reductions in nightmares, improvements in sleep quality, and progress toward your ideal self. Science-backed metrics show your transformation over time.',
    color: 'from-fuchsia-500 to-fuchsia-600'
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 bg-white/40 backdrop-blur">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            How It{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, guided journey from dream capture to transformation. Every step is designed to
            help you explore and reshape your inner world.
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-xl border-purple-200/50 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-12 gap-0">
                    <div className={`md:col-span-3 bg-gradient-to-br ${step.color} p-8 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                      {/* Decorative background */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <step.icon className="w-16 h-16 mb-4" />
                      </motion.div>
                      <div className="text-6xl font-light opacity-60 relative">{step.number}</div>
                    </div>
                    <div className="md:col-span-9 p-8 relative">
                      {/* Hover gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <div className="relative">
                        <h3 className="text-3xl font-medium text-gray-900 group-hover:text-purple-700 transition-colors mb-4">{step.title}</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">{step.description}</p>
                        {/* Decorative line */}
                        <div className={`mt-6 h-1 w-24 bg-gradient-to-r ${step.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-light text-gray-900 mb-4">The Science of Repetition</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Research shows that journaling for <strong>30+ days</strong> maximizes mental wellbeing
            benefits. Image Rehearsal Therapy shows partial remission after just <strong>2-3 weeks</strong>.
            Daily practice strengthens neural pathways through neuroplasticity—your brain literally
            rewires itself with consistent use.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
