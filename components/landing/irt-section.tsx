'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Activity, CheckCircle, TrendingUp } from 'lucide-react'

export function IRTSection() {
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
          <div className="inline-flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full text-sm text-pink-700 mb-6">
            <Shield className="w-4 h-4" />
            Level A Treatment Recommendation
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Image Rehearsal{' '}
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Therapy
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The American Academy of Sleep Medicine designates IRT as the <strong>treatment of choice
            (Level A)</strong> for PTSD-associated nightmares and nightmare disorder.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-light text-gray-900">What is Image Rehearsal Therapy?</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              IRT is a cognitive-behavioral intervention where you select a recurring nightmare, create
              a modified version with a positive or neutral outcome, and mentally rehearse the new
              scenario for 10-20 minutes daily.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your brain gradually replaces the traumatic dream pattern with the rehearsed version through
              the power of neuroplasticity and repetition.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Clinically Proven</h4>
                  <p className="text-gray-600">Large effect sizes on nightmare frequency, sleep quality, and PTSD symptoms</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Long-Lasting Results</h4>
                  <p className="text-gray-600">Effects sustained through 6-12 month follow-up periods</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Accessible Treatment</h4>
                  <p className="text-gray-600">Can be delivered digitally with telephone/app guidance</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600 text-white border-0 overflow-hidden shadow-2xl">
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-200 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              </div>
              <CardContent className="p-8 relative">
                <h3 className="text-3xl font-light mb-6 flex items-center gap-3">
                  <Shield className="w-8 h-8" />
                  Clinical Results
                </h3>
                <div className="space-y-6">
                  {[
                    { value: '70%', label: 'Success rate (response to treatment)', icon: '✓' },
                    { value: '-4.2', label: 'Average reduction in total nightmares', icon: '↓' },
                    { value: '2-3', label: 'Weeks until partial remission observed', icon: '⏱' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-5xl font-light mb-2">{item.value}</div>
                          <div className="text-pink-100">{item.label}</div>
                        </div>
                      </div>
                      {i < 2 && <div className="h-px bg-white/20 mt-6" />}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-purple-600" />
                  <h4 className="font-medium text-gray-900">Effect Sizes (Cohen's d)</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nightmare Frequency</span>
                    <span className="font-medium text-purple-600">d = 1.03</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Insomnia Severity</span>
                    <span className="font-medium text-purple-600">d = 1.12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nightmare Distress</span>
                    <span className="font-medium text-purple-600">d = 0.75</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 md:p-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <TrendingUp className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">How Rêve Implements IRT</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our Dream Manifestation feature is built on the principles of Image Rehearsal Therapy.
                After logging a dream, our AI helps you craft a positive reimagining with empowering
                narratives and beautiful visualizations.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/80 rounded-xl p-6">
                  <div className="text-3xl font-light text-purple-600 mb-2">1</div>
                  <h4 className="font-medium text-gray-900 mb-2">Capture</h4>
                  <p className="text-sm text-gray-600">Log your dream through text or voice</p>
                </div>
                <div className="bg-white/80 rounded-xl p-6">
                  <div className="text-3xl font-light text-purple-600 mb-2">2</div>
                  <h4 className="font-medium text-gray-900 mb-2">Transform</h4>
                  <p className="text-sm text-gray-600">AI generates positive manifestation narrative</p>
                </div>
                <div className="bg-white/80 rounded-xl p-6">
                  <div className="text-3xl font-light text-purple-600 mb-2">3</div>
                  <h4 className="font-medium text-gray-900 mb-2">Rehearse</h4>
                  <p className="text-sm text-gray-600">Listen daily to reinforce new patterns</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            <strong>Research Reference:</strong> Meta-analysis published in PMC4120639, American Academy
            of Sleep Medicine recommendations, and multiple peer-reviewed studies in psychiatric and sleep
            medicine journals (2022-2024).
          </p>
        </motion.div>
      </div>
    </section>
  )
}
