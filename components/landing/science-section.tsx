'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Brain, TrendingDown, Sparkles } from 'lucide-react'

const studies = [
  {
    title: 'Dream Journaling & Mental Health',
    journal: 'PMC8935176 - Systematic Review & Meta-Analysis, 2024',
    finding: 'Regular journaling produces 5% greater reduction in patient health measures across 20 randomized control trials with 31 outcomes.',
    stats: ['20-45% reduction in depression & anxiety', '23% decrease in cortisol levels', '30+ days = maximum benefit'],
    icon: BookOpen,
    color: 'purple'
  },
  {
    title: 'Neural Mechanisms of Journaling',
    journal: 'UCLA Neuroimaging Research',
    finding: 'Expressive writing activates the prefrontal cortex (executive control) while dampening amygdala activity (threat detection system).',
    stats: ['Improves immune function', 'Enhances cognitive performance', 'May extend lifespan'],
    icon: Brain,
    color: 'pink'
  },
  {
    title: 'Manifestation & Neuroplasticity',
    journal: 'Stanford Research, Dr. James Doty, 2024',
    finding: 'Visualization activates the same neural pathways as actual experience. Repeated practice strengthens self-belief circuits and reduces fear responses.',
    stats: ['Activates brain reward centers', 'Creates new neural pathways', 'Primes subconscious for opportunities'],
    icon: Sparkles,
    color: 'blue'
  },
  {
    title: 'Dream Recall & Memory',
    journal: 'Current Biology & Sleep Medicine Research',
    finding: '90% of people remember dreams when awakened from REM sleep. Dreams play a proven role in memory consolidation and creative problem-solving.',
    stats: ['45% of dreams fully remembered', '80% recall in sleep studies', 'Interest predicts recall'],
    icon: TrendingDown,
    color: 'violet'
  }
]

export function ScienceSection() {
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
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-sm text-purple-700 mb-6">
            <BookOpen className="w-4 h-4" />
            Peer-Reviewed Research
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Backed by{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Science
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature in Rêve is grounded in published research from leading universities and
            medical institutions. This isn't just an app—it's a science-backed tool for transformation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {studies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/90 backdrop-blur border-purple-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 group overflow-hidden relative">
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${study.color}-500/0 to-${study.color}-500/0 group-hover:from-${study.color}-500/5 group-hover:to-${study.color}-500/10 transition-all duration-300`} />
                <CardContent className="p-8 space-y-6 relative">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${study.color}-500 to-${study.color}-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <study.icon className="w-7 h-7 text-white" />
                      </div>
                      {/* Decorative glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-${study.color}-400 to-${study.color}-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity -z-10`} />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-medium text-gray-900 group-hover:text-purple-700 transition-colors mb-2">{study.title}</h3>
                      <p className="text-sm text-purple-600 font-medium">{study.journal}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed italic border-l-4 border-purple-300 group-hover:border-purple-500 pl-4 transition-colors">
                    "{study.finding}"
                  </p>

                  <div className="space-y-2 pt-4 border-t border-purple-100">
                    {study.stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-${study.color}-500 mt-2 flex-shrink-0`} />
                        <p className="text-sm text-gray-600">{stat}</p>
                      </motion.div>
                    ))}
                  </div>
                  {/* Decorative corner element */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-${study.color}-500/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Research citations include studies published in <strong>PubMed Central</strong>, <strong>Social
            Cognitive and Affective Neuroscience</strong>, <strong>Current Biology</strong>, and
            recommendations from the <strong>American Academy of Sleep Medicine</strong>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
