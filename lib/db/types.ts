export interface Profile {
  id: string
  name: string
  age: number | null
  quality_loved: string | null
  quality_desired: string | null
  idol_name: string | null
  selfie_url: string | null
  ideal_self_narrative: string | null
  ideal_self_image_url: string | null
  subscription_tier: 'free' | 'premium'
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'trialing'
  trial_ends_at: string | null
  subscription_ends_at: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface Dream {
  id: string
  user_id: string
  title: string | null
  content: string
  voice_url: string | null
  interpretation: string | null
  image_url: string | null
  video_url: string | null
  media_status: 'pending' | 'processing' | 'completed' | 'failed'
  themes: string[]
  emotions: string[]
  created_at: string
  updated_at: string
}

export interface Manifestation {
  id: string
  user_id: string
  dream_id: string | null
  title: string
  narrative: string
  image_url: string | null
  video_url: string | null
  audio_url: string | null
  media_status: 'pending' | 'processing' | 'completed' | 'failed'
  tags: string[]
  is_seed: boolean
  play_count: number
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface DreamAnalytics {
  id: string
  user_id: string
  period_start: string
  period_end: string
  dream_count: number
  common_themes: string[]
  common_emotions: string[]
  created_at: string
}
