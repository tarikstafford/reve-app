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

      // Generate narrative with title and tags
      const manifestationPrompt = `Create a manifestation for ${profile.name} focused on ${theme}. They love their ${profile.qualityLoved} and are developing ${profile.qualityDesired}, inspired by ${profile.idol}.

Return a JSON object with:
- title: A short, inspiring title (3-5 words)
- narrative: A powerful manifestation narrative (3-4 sentences) in second person ("You are..."). Make it dreamlike, empowering, and suitable for daily repetition
- tags: An array of 3-5 relevant tags (e.g., "confidence", "self-love", "transformation", "peace", "strength", "clarity", "abundance", "joy")

Example format:
{
  "title": "Radiant Self-Confidence",
  "narrative": "You are standing in your power, radiating confidence with every breath...",
  "tags": ["confidence", "self-love", "empowerment"]
}`

      const manifestationResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a master of positive psychology and manifestation practices. Write empowering, dreamlike affirmations. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: manifestationPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 250,
        response_format: { type: 'json_object' }
      })

      const manifestationData = JSON.parse(manifestationResponse.choices[0].message.content || '{}')
      const { title, narrative, tags } = manifestationData

      // Generate audio using ElevenLabs (placeholder for now)
      // In production, you would call ElevenLabs API here
      const audioUrl = null // TODO: Implement ElevenLabs integration

      // Save manifestation to database immediately WITHOUT media (will be generated async)
      const { data: manifestation, error } = await supabase
        .from('manifestations')
        .insert({
          user_id: userId,
          title: title || `${theme.charAt(0).toUpperCase() + theme.slice(1)} Manifestation`,
          narrative: narrative,
          tags: tags || [theme],
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
