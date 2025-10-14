import { ScienceHero } from '@/components/science/science-hero'
import { DisclaimerSection } from '@/components/science/disclaimer-section'
import { ResearchSection } from '@/components/science/research-section'
import { Footer } from '@/components/landing/footer'

export const metadata = {
  title: 'Science & Research - Rêve',
  description: 'Explore the research and evidence behind dream work, Image Rehearsal Therapy, and manifestation practices.',
}

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-black">
      <ScienceHero />
      <DisclaimerSection />
      <ResearchSection />
      <Footer />
    </div>
  )
}
