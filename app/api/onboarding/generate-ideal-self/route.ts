import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { name, age, qualityLoved, qualityDesired, idol, selfie } = await request.json()

    // Generate narrative using GPT-4
    const narrativePrompt = `You are a compassionate life coach helping someone envision their ideal self. Based on the following information, write a beautiful, inspiring narrative (2-3 sentences) about who they are becoming:

Name: ${name}
Age: ${age}
Quality they love about themselves: ${qualityLoved}
Quality they desire: ${qualityDesired}
Person they idolize: ${idol}

Write in second person ("You are..."). Be poetic, dreamlike, and encouraging. Focus on their journey of growth and transformation.`

    const narrativeResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a poetic life coach who writes beautiful, inspiring narratives about personal transformation.'
        },
        {
          role: 'user',
          content: narrativePrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    })

    const narrative = narrativeResponse.choices[0].message.content

    // Generate image using DALL-E 3
    const imagePrompt = `A beautiful, ethereal portrait representing an ideal self: embodying ${qualityLoved} while growing into ${qualityDesired}, inspired by the essence of ${idol}. Surrealist, dreamlike, soft lighting, gentle colors, transcendent mood. Artistic and abstract, not a specific person.`

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    })

    const imageUrl = imageResponse.data?.[0]?.url || ''

    return NextResponse.json({
      success: true,
      narrative,
      imageUrl
    })
  } catch (error) {
    console.error('Error generating ideal self:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate ideal self'
      },
      { status: 500 }
    )
  }
}
