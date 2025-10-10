import { create } from 'zustand'
import { Dream, Manifestation } from '@/lib/db/types'

interface DreamState {
  dreams: Dream[]
  manifestations: Manifestation[]
  selectedDream: Dream | null
  setDreams: (dreams: Dream[]) => void
  addDream: (dream: Dream) => void
  setManifestations: (manifestations: Manifestation[]) => void
  addManifestation: (manifestation: Manifestation) => void
  setSelectedDream: (dream: Dream | null) => void
}

export const useDreamStore = create<DreamState>((set) => ({
  dreams: [],
  manifestations: [],
  selectedDream: null,
  setDreams: (dreams) => set({ dreams }),
  addDream: (dream) => set((state) => ({ dreams: [dream, ...state.dreams] })),
  setManifestations: (manifestations) => set({ manifestations }),
  addManifestation: (manifestation) => set((state) => ({
    manifestations: [manifestation, ...state.manifestations]
  })),
  setSelectedDream: (selectedDream) => set({ selectedDream }),
}))
