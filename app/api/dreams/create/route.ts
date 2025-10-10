import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()
    const supabase = await createClient()

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

    // Generate surrealist art representing the dream
    const imagePrompt = `Surrealist dreamscape representing: ${content.slice(0, 500)}. Ethereal, abstract, soft colors, dreamlike atmosphere, artistic interpretation.`

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    })

    const imageUrl = imageResponse.data?.[0]?.url || ''

    // Save dream to database
    const { data: dream, error: dreamError } = await supabase
      .from('dreams')
      .insert({
        user_id: user.id,
        title,
        content,
        interpretation: analysis.interpretation,
        image_url: imageUrl,
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
