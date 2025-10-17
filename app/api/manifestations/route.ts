import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const getOpenAI = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build'
})

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch user's manifestations
    const { data: manifestations, error } = await supabase
      .from('manifestations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching manifestations:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch manifestations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      manifestations: manifestations || []
    })
  } catch (error) {
    console.error('Error in manifestations API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { dreamContext, theme } = await request.json()

    if (!dreamContext || !theme) {
      return NextResponse.json(
        { success: false, error: 'Dream context and theme are required' },
        { status: 400 }
      )
    }

    const openai = getOpenAI()

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Generate narrative with GPT-4o
    const manifestationPrompt = `Create a transformative Image Rehearsal Therapy (IRT) manifestation based on this dream/context: "${dreamContext}"

Focus on the theme: ${theme}

${profile ? `Personalize for ${profile.name}, who loves their ${profile.qualityLoved} and is developing ${profile.qualityDesired}.` : ''}

This should be a transformative IRT narrative - like a chapter in a book. Create a vivid story where they transform the challenging situation from their dream into an empowering one.

Structure it like this example:
"You walk into a party and feel the familiar tension of being an outsider. But this time, you notice something different - a golden key in your pocket. With curiosity, you discover a hidden door you've never seen before. You turn the key, and it opens to reveal your true self. Now you're dancing freely, your body moving with natural grace. People are drawn to your authentic energy. You connect deeply with others, sharing laughter and meaningful moments. This is who you truly are."

Return a JSON object with:
- title: A compelling title (3-5 words) that captures the transformation
- narrative: A vivid IRT narrative (8-12 sentences) in second person. Start with a challenging moment from their dream/context, introduce a symbolic object or turning point, then show the complete transformation. Use specific, visual details. Make it feel like a lucid dream where they rehearse their ideal self.
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

    // Save manifestation to database immediately WITHOUT media (will be generated async)
    const { data: manifestation, error } = await supabase
      .from('manifestations')
      .insert({
        user_id: user.id,
        title: title || 'Custom Manifestation',
        narrative: narrative,
        tags: tags || [theme],
        media_status: 'pending',
        audio_url: null,
        is_seed: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving manifestation:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save manifestation' },
        { status: 500 }
      )
    }

    // Queue media generation for this manifestation
    const imagePrompt = `Surrealist dreamscape representing the transformation in this story: ${narrative.substring(0, 200)}. Ethereal, beautiful, soft pastel colors, floating elements, peaceful and empowering mood. Abstract and artistic, like a lucid dream. NO TEXT, NO WORDS, NO LETTERS in the image.`
    const videoPrompt = `Slow, gentle movements in a dreamlike atmosphere showing transformation and empowerment. Floating particles, soft transitions, peaceful and meditative. Ethereal lighting with subtle color shifts.`

    await supabase
      .from('media_generation_queue')
      .insert({
        entity_type: 'manifestation',
        entity_id: manifestation.id,
        user_id: user.id,
        image_prompt: imagePrompt,
        video_prompt: videoPrompt,
        status: 'pending'
      })

    // Trigger media generation queue processing (fire and forget)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/media/process-queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error('Failed to trigger media generation:', err))

    return NextResponse.json({
      success: true,
      manifestation
    })
  } catch (error) {
    console.error('Error creating manifestation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create manifestation' },
      { status: 500 }
    )
  }
}
