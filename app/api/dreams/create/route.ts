import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const getOpenAI = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build'
})

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()
    const supabase = await createClient()
    const openai = getOpenAI()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Interpret the dream using GPT-4
    const interpretationPrompt = `Analyze this dream and provide:
1. A brief interpretation (2-3 sentences)
2. Main themes (up to 3)
3. Emotions present (up to 3)

Dream: ${content}

Respond in JSON format:
{
  "interpretation": "...",
  "themes": ["theme1", "theme2"],
  "emotions": ["emotion1", "emotion2"]
}`

    const interpretationResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a dream analyst with expertise in psychology and symbolism. Provide insightful, compassionate interpretations.'
        },
        {
          role: 'user',
          content: interpretationPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 300
    })

    const analysis = JSON.parse(interpretationResponse.choices[0].message.content || '{}')

    // Save dream to database immediately WITHOUT media (will be generated async)
    const { data: dream, error: dreamError } = await supabase
      .from('dreams')
      .insert({
        user_id: user.id,
        title,
        content,
        interpretation: analysis.interpretation,
        media_status: 'pending',
        themes: analysis.themes || [],
        emotions: analysis.emotions || []
      })
      .select()
      .single()

    if (dreamError) {
      console.error('Dream error:', dreamError)
      return NextResponse.json(
        { success: false, error: 'Failed to save dream' },
        { status: 500 }
      )
    }

    // Queue media generation (async - don't wait for it)
    const imagePrompt = `A surrealist dreamscape with ethereal, abstract imagery. ${content.slice(0, 400)}. Soft colors, dreamlike atmosphere, mystical, cinematic lighting. NO TEXT, NO WORDS, NO LETTERS in the image.`
    const videoPrompt = `Ethereal dream sequence with slow, flowing movements. The scene breathes and transforms subtly, with soft particles floating through space. Gentle, mystical atmosphere with dreamy lighting transitions.`

    await supabase
      .from('media_generation_queue')
      .insert({
        entity_type: 'dream',
        entity_id: dream.id,
        user_id: user.id,
        image_prompt: imagePrompt,
        video_prompt: videoPrompt,
        status: 'pending'
      })

    // Trigger background generation (fire and forget)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/media/process-queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error('Failed to trigger media generation:', err))

    return NextResponse.json({
      success: true,
      dream
    })
  } catch (error) {
    console.error('Error creating dream:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create dream' },
      { status: 500 }
    )
  }
}
