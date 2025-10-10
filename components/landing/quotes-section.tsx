'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const quotes = [
  {
    text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    author: "Carl Jung",
    title: "Swiss Psychiatrist & Psychoanalyst"
  },
  {
    text: "The dream is the small hidden door in the deepest and most intimate sanctum of the soul, which opens to that primeval cosmic night that was soul long before there was conscious ego.",
    author: "Carl Jung",
    title: "Memories, Dreams, Reflections"
  },
  {
    text: "Who looks outside, dreams; who looks inside, awakes.",
    author: "Carl Jung",
    title: "Pioneer of Analytical Psychology"
  },
  {
    text: "The interpretation of dreams is the royal road to a knowledge of the unconscious activities of the mind.",
    author: "Sigmund Freud",
    title: "The Interpretation of Dreams, 1899"
  },
  {
    text: "Although the events we appear to perceive in dreams are illusory, our feelings in response to dream content are real.",
    author: "Stephen LaBerge",
    title: "Lucid Dreaming Pioneer & Stanford Researcher"
  },
  {
    text: "Dreams involve a search for new and creative ways to put memories and ideas together. They can make associations that we wouldn't make when we're awake.",
    author: "Robert Stickgold",
    title: "Harvard Medical School, Sleep & Cognition Lab"
  }
]

export function QuotesSection() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-300 rounded-full blur-3xl"
        />
      </div>
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light mb-6">
            Words from the{' '}
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Pioneers
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            For over a century, researchers and psychologists have recognized the profound importance
            of dreams in understanding the human psyche.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group relative overflow-hidden">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-300" />
                <CardContent className="p-8 space-y-6 relative">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Quote className="w-10 h-10 text-purple-300 group-hover:text-pink-300 transition-colors" />
                  </motion.div>
                  <p className="text-lg text-white/90 leading-relaxed italic">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-white/20">
                    <p className="font-medium text-white group-hover:text-purple-200 transition-colors">{quote.author}</p>
                    <p className="text-sm text-purple-200">{quote.title}</p>
                  </div>
                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
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
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-white/20">
            <Quote className="w-12 h-12 text-purple-300 mx-auto mb-6" />
            <p className="text-2xl md:text-3xl font-light text-white leading-relaxed italic mb-6">
              &ldquo;We also live in our dreams, we do not live only by day. Sometimes we accomplish our
              greatest deeds in dreams.&rdquo;
            </p>
            <p className="text-purple-200">— Carl Jung</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
