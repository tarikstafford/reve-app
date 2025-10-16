import { StoryHero } from '@/components/landing/story-hero'
import { TrappedSection } from '@/components/landing/trapped-section'
import { BridgeSection } from '@/components/landing/bridge-section'
import { ToolSection } from '@/components/landing/tool-section'
import { TransformationSection } from '@/components/landing/transformation-section'
import { DestinySection } from '@/components/landing/destiny-section'
import { GuidesSection } from '@/components/landing/guides-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <StoryHero />
      <TrappedSection />
      <BridgeSection />
      <ToolSection />
      <TransformationSection />
      <DestinySection />
      <GuidesSection />
      <Footer />
    </div>
  )
}
