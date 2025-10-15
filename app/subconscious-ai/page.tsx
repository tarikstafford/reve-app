import { SubconsciousAIHero } from '@/components/subconscious-ai/subconscious-ai-hero'
import { VisualMappingSection } from '@/components/subconscious-ai/visual-mapping-section'
import { FineTunedModelsSection } from '@/components/subconscious-ai/finetuned-models-section'
import { AIChatSection } from '@/components/subconscious-ai/ai-chat-section'
import { FutureApplicationsSection } from '@/components/subconscious-ai/future-applications-section'
import { Footer } from '@/components/landing/footer'

export const metadata = {
  title: 'Subconscious AI - Rêve',
  description: 'Discover how AI maps, interprets, and connects with your subconscious mind through dreams, manifestations, and personalized analysis.',
}

export default function SubconsciousAIPage() {
  return (
    <div className="min-h-screen bg-black">
      <SubconsciousAIHero />
      <VisualMappingSection />
      <FineTunedModelsSection />
      <AIChatSection />
      <FutureApplicationsSection />
      <Footer />
    </div>
  )
}
