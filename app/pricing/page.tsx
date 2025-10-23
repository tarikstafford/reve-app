import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { PricingSection } from '@/components/pricing/pricing-section'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-light text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Start with our free plan and upgrade anytime to unlock unlimited dreams,
            AI chat, and advanced features.
          </p>
        </div>
        <PricingSection />
      </div>
    </DashboardLayout>
  )
}
