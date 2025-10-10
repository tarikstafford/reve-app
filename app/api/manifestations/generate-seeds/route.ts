import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { userId, profile } = await request.json()
    const supabase = await createClient()

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

      // Generate image
      const imagePrompt = `Surrealist dreamscape representing ${theme}: ethereal, beautiful, soft pastel colors, floating elements, peaceful and empowering mood. Abstract and artistic, like a lucid dream.`

      const imageResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      })

      const imageUrl = imageResponse.data[0].url

      // Generate audio using ElevenLabs (placeholder for now)
      // In production, you would call ElevenLabs API here
      const audioUrl = null // TODO: Implement ElevenLabs integration

      // Save to database
      const { data: manifestation, error } = await supabase
        .from('manifestations')
        .insert({
          user_id: userId,
          title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Manifestation`,
          narrative: narrative,
          image_url: imageUrl,
          audio_url: audioUrl,
          is_seed: true
        })
        .select()
        .single()

      if (!error && manifestation) {
        manifestations.push(manifestation)
      }

      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

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
