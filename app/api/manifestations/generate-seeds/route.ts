import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const getOpenAI = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build'
})

export async function POST(request: NextRequest) {
  try {
    const { userId, profile } = await request.json()

    // Use service role key for internal API calls
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const openai = getOpenAI()

    const manifestations = []

    // Generate 3 seed manifestations
    for (let i = 0; i < 3; i++) {
      const theme = i === 0 ? 'confidence' : i === 1 ? 'growth' : 'peace'

      // Generate narrative
      const narrativePrompt = `Create a short, powerful manifestation narrative (3-4 sentences) for ${profile.name} focused on ${theme}. They love their ${profile.qualityLoved} and are developing ${profile.qualityDesired}, inspired by ${profile.idol}.

Write in second person ("You are..."). Make it dreamlike, empowering, and suitable for daily repetition. This will be read aloud as a positive affirmation.`

      const narrativeResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a master of positive psychology and manifestation practices. Write empowering, dreamlike affirmations.'
          },
          {
            role: 'user',
            content: narrativePrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      })

      const narrative = narrativeResponse.choices[0].message.content

      // Generate audio using ElevenLabs (placeholder for now)
      // In production, you would call ElevenLabs API here
      const audioUrl = null // TODO: Implement ElevenLabs integration

      // Save manifestation to database immediately WITHOUT media (will be generated async)
      const { data: manifestation, error } = await supabase
        .from('manifestations')
        .insert({
          user_id: userId,
          title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Manifestation`,
          narrative: narrative,
          media_status: 'pending',
          audio_url: audioUrl,
          is_seed: true
        })
        .select()
        .single()

      if (!error && manifestation) {
        manifestations.push(manifestation)

        // Queue media generation for this manifestation
        const imagePrompt = `Surrealist dreamscape representing ${theme}: ethereal, beautiful, soft pastel colors, floating elements, peaceful and empowering mood. Abstract and artistic, like a lucid dream. NO TEXT, NO WORDS, NO LETTERS in the image.`
        const videoPrompt = `Slow, gentle movements in a dreamlike atmosphere. Floating particles, soft transitions, peaceful and meditative. Ethereal lighting with subtle color shifts.`

        await supabase
          .from('media_generation_queue')
          .insert({
            entity_type: 'manifestation',
            entity_id: manifestation.id,
            user_id: userId,
            image_prompt: imagePrompt,
            video_prompt: videoPrompt,
            status: 'pending'
          })
      }

      // Small delay between manifestations
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Trigger media generation queue processing (fire and forget)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/media/process-queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error('Failed to trigger media generation:', err))

    return NextResponse.json({
      success: true,
      manifestations
    })
  } catch (error) {
    console.error('Error generating seed manifestations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate manifestations' },
      { status: 500 }
    )
  }
}
