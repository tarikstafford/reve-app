'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Moon, Sparkles, MessageCircle, User } from 'lucide-react'
import { DreamArchive } from '@/components/dreams/dream-archive'
import { DreamLogDialog } from '@/components/dreams/dream-log-dialog'
import { ManifestationLibrary } from '@/components/manifestations/manifestation-library'
import { SubconsciousChat } from '@/components/subconscious/subconscious-chat'
import { ProfileView } from '@/components/profile/profile-view'

export function DashboardContent() {
  return (
    <Tabs defaultValue="dreams" className="w-full">
      <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 bg-white/80 backdrop-blur p-1 rounded-full">
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
        <TabsTrigger value="profile" className="rounded-full">
          <User className="w-4 h-4 mr-2" />
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dreams" className="space-y-6">
        <div className="flex justify-center">
          <DreamLogDialog />
        </div>
        <DreamArchive />
      </TabsContent>

      <TabsContent value="manifestations">
        <ManifestationLibrary />
      </TabsContent>

      <TabsContent value="subconscious">
        <SubconsciousChat />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileView />
      </TabsContent>
    </Tabs>
  )
}
