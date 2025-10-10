'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  'AI-powered dream interpretation & visualization',
  'Evidence-based Image Rehearsal Therapy',
  'Voice recording with instant transcription',
  'Searchable dream archive with patterns',
  'Personalized manifestation narratives',
  'Subconscious conversation (unlocks at 10 dreams)',
  'Beautiful, calming interface',
  '7-day free trial, then $9/month'
]

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 p-8 md:p-16 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
                    <Sparkles className="w-4 h-4" />
                    Start Your Transformation Today
                  </div>
                  <h2 className="text-5xl md:text-6xl font-light mb-6">
                    Begin Your Journey Into the Subconscious
                  </h2>
                  <p className="text-xl text-purple-100 leading-relaxed">
                    Join thousands exploring their inner world with Rêve. Experience the power of
                    AI-enhanced dream work backed by decades of psychological research.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 pt-6"
                >
                  <Link href="/onboarding">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all group"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg rounded-full border-2 border-white text-white hover:bg-white/10"
                  >
                    View Pricing
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-medium mb-6">Everything Included:</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-purple-100">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 pt-12 border-t border-white/20 text-center"
            >
              <p className="text-purple-100 max-w-3xl mx-auto">
                <strong>100% Private & Encrypted.</strong> Your dreams are yours alone. All data is
                encrypted end-to-end and never shared. Cancel anytime, keep your dream archive forever.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
