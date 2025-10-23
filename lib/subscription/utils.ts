import { Profile } from '@/lib/db/types'

export function isPremium(profile: Profile | null): boolean {
  if (!profile) return false
  return (
    profile.subscription_tier === 'premium' &&
    profile.subscription_status === 'active'
  )
}

export function canCreateDream(profile: Profile | null, dreamCount: number): boolean {
  if (isPremium(profile)) return true
  return dreamCount < 10 // Free tier limit
}

export function canAccessSubconsciousChat(profile: Profile | null): boolean {
  return isPremium(profile)
}

export function canAccessAnalystPerspectives(profile: Profile | null): boolean {
  return isPremium(profile)
}
