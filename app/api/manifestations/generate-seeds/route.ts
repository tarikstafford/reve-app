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

This should be a transformative Image Rehearsal Therapy (IRT) narrative - like a chapter in a book. Create a vivid story where they transform a challenging situation into an empowering one.

Structure it like this example:
"You walk into a party and feel the familiar tension of being an outsider. But this time, you notice something different - a golden key in your pocket. With curiosity, you discover a hidden door you've never seen before. You turn the key, and it opens to reveal your true self. Now you're dancing freely, your body moving with natural grace. People are drawn to your authentic energy. You connect deeply with others, sharing laughter and meaningful moments. This is who you truly are."

Return a JSON object with:
- title: A compelling title (3-5 words) that captures the transformation
- narrative: A vivid IRT narrative (8-12 sentences) in second person. Start with a challenging moment, introduce a symbolic object or turning point, then show the complete transformation. Use specific, visual details. Make it feel like a lucid dream where they rehearse their ideal self.
- tags: An array of 3-5 relevant tags

Example format:
{
  "title": "The Secret Door",
  "narrative": "Your full transformative story here...",
  "tags": ["transformation", "confidence", "connection"]
}`

      const manifestationResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a master of Image Rehearsal Therapy and transformative storytelling. Write vivid, narrative-driven manifestations that help people rehearse their ideal self. Use specific visual imagery and symbolic objects. Create complete story arcs from challenge to triumph. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: manifestationPrompt
          }
        ],
        temperature: 0.9,
        max_tokens: 800,
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
