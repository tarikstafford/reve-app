'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/auth-helpers'
import { useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/landing')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-light text-gray-800 mb-2">
                <span className="text-purple-600">Rêve</span>
              </h1>
              <p className="text-gray-600">Your journey into the subconscious</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
