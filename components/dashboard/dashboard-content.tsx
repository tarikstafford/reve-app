'use client'

import { useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Moon, Sparkles, MessageCircle } from 'lucide-react'
import { DreamArchive } from '@/components/dreams/dream-archive'
import { DreamLogDialog } from '@/components/dreams/dream-log-dialog'
import { ManifestationLibrary } from '@/components/manifestations/manifestation-library'
import { SubconsciousChat } from '@/components/subconscious/subconscious-chat'

export function DashboardContent() {
  const dreamArchiveRefreshRef = useRef<(() => void) | null>(null)

  const handleDreamSaved = () => {
    // Trigger refresh of dream archive
    if (dreamArchiveRefreshRef.current) {
      dreamArchiveRefreshRef.current()
    }
  }

  return (
    <Tabs defaultValue="dreams" className="w-full">
      <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur p-1 rounded-full">
        <TabsTrigger value="dreams" className="rounded-full">
          <Moon className="w-4 h-4 mr-2" />
          Dreams
        </TabsTrigger>
        <TabsTrigger value="manifestations" className="rounded-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Manifestations
        </TabsTrigger>
        <TabsTrigger value="subconscious" className="rounded-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Subconscious
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dreams" className="space-y-6">
        <div className="flex justify-center">
          <DreamLogDialog onDreamSaved={handleDreamSaved} />
        </div>
        <DreamArchive onRefreshRef={dreamArchiveRefreshRef} />
      </TabsContent>

      <TabsContent value="manifestations">
        <ManifestationLibrary />
      </TabsContent>

      <TabsContent value="subconscious">
        <SubconsciousChat />
      </TabsContent>
    </Tabs>
  )
}
