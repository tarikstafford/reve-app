import { LandingHero } from '@/components/landing/landing-hero'
import { FeaturesSection } from '@/components/landing/features-section'
import { ScienceSection } from '@/components/landing/science-section'
import { IRTSection } from '@/components/landing/irt-section'
import { QuotesSection } from '@/components/landing/quotes-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <LandingHero />
      <FeaturesSection />
      <ScienceSection />
      <IRTSection />
      <HowItWorksSection />
      <QuotesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
