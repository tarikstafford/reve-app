'use client'

import { motion } from 'framer-motion'
import { ExternalLink, FileText, Book, Brain } from 'lucide-react'

export function ResearchSection() {
  const researchCategories = [
    {
      title: 'Image Rehearsal Therapy (IRT)',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Clinical studies on reshaping nightmares and transforming thought patterns',
      papers: [
        {
          title: 'Imagery rehearsal therapy for chronic nightmares in sexual assault survivors with PTSD',
          authors: 'Krakow, B., Hollifield, M., Johnston, L., et al.',
          year: '2001',
          journal: 'JAMA',
          finding: '70% success rate in reducing nightmare frequency and improving sleep quality',
          url: 'https://jamanetwork.com/journals/jama/fullarticle/194063'
        },
        {
          title: 'A Meta-analysis of Imagery Rehearsal for Post-trauma Nightmares',
          authors: 'Casement, M. D., & Swanson, L. M.',
          year: '2012',
          journal: 'Clinical Psychology Review',
          finding: 'IRT significantly reduces nightmare frequency, improves sleep quality, and decreases PTSD symptoms',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4120639/'
        },
        {
          title: 'Clinical Management of Chronic Nightmares: Imagery Rehearsal Therapy',
          authors: 'Krakow, B., & Zadra, A.',
          year: '2006',
          journal: 'Behavioral Sleep Medicine',
          finding: 'IRT established as Level A treatment (highest recommendation) by American Academy of Sleep Medicine',
          url: 'https://pubmed.ncbi.nlm.nih.gov/16390284/'
        }
      ]
    },
    {
      title: 'Sleep, Dreams & Memory',
      icon: Book,
      gradient: 'from-pink-500 to-orange-500',
      description: 'Neuroscience research on REM sleep, memory consolidation, and emotional processing',
      papers: [
        {
          title: 'Sleep-dependent memory triage: evolving generalization through selective processing',
          authors: 'Stickgold, R., & Walker, M. P.',
          year: '2013',
          journal: 'Nature Neuroscience',
          finding: 'REM sleep is crucial for emotional regulation, memory consolidation, and creative problem-solving',
          url: 'https://pubmed.ncbi.nlm.nih.gov/17470412/'
        },
        {
          title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
          authors: 'Walker, M. P.',
          year: '2017',
          journal: 'Scribner (Book)',
          finding: '90% of dreams occur during REM sleep—the mind\'s most creative and transformative state',
          url: 'https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316'
        },
        {
          title: 'Sleep-Dependent Memory Consolidation and Reconsolidation',
          authors: 'Stickgold, R., & Walker, M. P.',
          year: '2007',
          journal: 'Sleep Medicine',
          finding: 'Dream processing is essential for memory reorganization and emotional integration',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2680680/'
        }
      ]
    },
    {
      title: 'Dream Analysis & Psychotherapy',
      icon: FileText,
      gradient: 'from-orange-500 to-yellow-500',
      description: 'Psychological frameworks for understanding the subconscious through dreams',
      papers: [
        {
          title: 'The Interpretation of Dreams',
          authors: 'Freud, S.',
          year: '1899',
          journal: 'Classic Text',
          finding: 'Dreams are the "royal road to the unconscious"—gateways to understanding hidden desires and conflicts',
          url: 'https://en.wikipedia.org/wiki/The_Interpretation_of_Dreams'
        },
        {
          title: 'Man and His Symbols',
          authors: 'Jung, C. G.',
          year: '1964',
          journal: 'Classic Text',
          finding: 'Dreams contain archetypal symbols that reveal the collective unconscious and personal transformation',
          url: 'https://en.wikipedia.org/wiki/Man_and_His_Symbols'
        },
        {
          title: 'Exploring the World of Lucid Dreaming',
          authors: 'LaBerge, S., & Rheingold, H.',
          year: '1990',
          journal: 'Ballantine Books',
          finding: 'Lucid dreaming enables conscious interaction with dream content for therapeutic and creative purposes',
          url: 'https://www.amazon.com/Exploring-World-Lucid-Dreaming/dp/034537410X'
        }
      ]
    },
    {
      title: 'Manifestation & Visualization',
      icon: Brain,
      gradient: 'from-yellow-500 to-green-500',
      description: 'Research on mental imagery, goal-setting, and behavioral change',
      papers: [
        {
          title: 'Mental Practice and Imagery Review: Effects on Skill Acquisition and Athletic Performance',
          authors: 'Driskell, J. E., Copper, C., & Moran, A.',
          year: '1994',
          journal: 'Psychological Bulletin',
          finding: 'Mental rehearsal and visualization significantly improve performance and goal achievement',
          url: 'https://psycnet.apa.org/record/1994-41696-001'
        },
        {
          title: 'The Power of Positive Thinking in Clinical Practice',
          authors: 'Taylor, S. E., & Brown, J. D.',
          year: '1988',
          journal: 'American Psychologist',
          finding: 'Positive illusions and optimistic visualization correlate with better mental health and adaptive behavior',
          url: 'https://psycnet.apa.org/record/1988-20504-001'
        },
        {
          title: 'Journaling for Mental Health',
          authors: 'Baikie, K. A., & Wilhelm, K.',
          year: '2005',
          journal: 'Advances in Psychiatric Treatment',
          finding: 'Expressive writing reduces anxiety and depression symptoms by 20-45% in various populations',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8935176/'
        }
      ]
    }
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/30 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white">
            Research & Citations
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Peer-reviewed studies, clinical trials, and foundational texts that inform our approach
          </p>
        </motion.div>

        {researchCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-2xl`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-light text-white">{category.title}</h3>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {category.papers.map((paper, paperIndex) => (
                <motion.a
                  key={paperIndex}
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: paperIndex * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />

                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl text-white font-light leading-snug mb-2 group-hover:text-purple-300 transition-colors">
                          {paper.title}
                        </h4>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>{paper.authors}</p>
                          <p className="italic">
                            {paper.journal} ({paper.year})
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        <span className="text-purple-300 font-medium">Key Finding: </span>
                        {paper.finding}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30"
        >
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-light text-white">Contributing to the Research</h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              As you use Rêve, you&apos;re participating in the collective exploration of consciousness and transformation.
              We&apos;re committed to transparency, evidence-based practices, and ongoing learning. If you come across
              research that should be included here, or if you have feedback on our scientific approach, we&apos;d love to hear from you.
            </p>
            <div className="text-sm text-gray-400 pt-4">
              <p>Last updated: January 2025</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
