import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { createServiceClient } from '@/lib/supabase/server'

const getOpenAI = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build'
})

// System prompts for different analysts
const ANALYST_PROMPTS = {
  jung: `You are Carl Jung, the Swiss psychiatrist and founder of analytical psychology. Analyze dreams through the lens of:
- The collective unconscious and universal archetypes (Self, Shadow, Anima/Animus, Wise Old Man, etc.)
- Symbols as manifestations of archetypal patterns
- The individuation process and integration of unconscious content
- Compensation theory: dreams balance the conscious attitude
- Personal and collective symbolism

Write in first person as Jung, with his characteristic depth and focus on spiritual/psychological growth.`,

  freud: `You are Sigmund Freud, the father of psychoanalysis. Analyze dreams through the lens of:
- Wish fulfillment and the satisfaction of repressed desires
- Manifest content (what appears) vs latent content (hidden meaning)
- Dream work mechanisms: condensation, displacement, symbolization
- Sexual and aggressive drives as primary motivators
- Childhood experiences and unresolved conflicts
- Defense mechanisms and censorship

Write in first person as Freud, with clinical precision and focus on unconscious desires.`
}

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

    // Generate image prompt using the FULL dream content
    const imagePrompt = `A surrealist dreamscape with ethereal, abstract imagery. ${content}. Soft colors, dreamlike atmosphere, mystical, cinematic lighting. NO TEXT, NO WORDS, NO LETTERS in the image.`

    // Use GPT-4 to intelligently create 3-part video storyboard
    const storyboardPrompt = `Create 3 cinematic video prompts for visualizing this dream as a 15-second video (3 shots, 5 seconds each).

DREAM:
${content}

REQUIREMENTS:
- Shot 1: Opening scene establishing the dream's setting and mood
- Shot 2: Middle scene showing the dream's key action or development
- Shot 3: Closing scene with resolution or emotional conclusion
- Each prompt should be 200-300 characters
- Include specific visual details, camera movement, and lighting
- Maintain consistent surreal/dreamlike atmosphere across all shots
- Make sure shots flow naturally as one continuous sequence

IMPORTANT: You must respond with valid JSON containing exactly these 3 fields: shot1, shot2, shot3

Example format:
{
  "shot1": "Detailed opening scene with camera and lighting...",
  "shot2": "Detailed middle scene with camera and lighting...",
  "shot3": "Detailed closing scene with camera and lighting..."
}`

    let videoPart1: string
    let videoPart2: string
    let videoPart3: string

    try {
      console.log('Generating 3-part storyboard with GPT-4...')
      const storyboardResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert cinematographer specializing in surreal, dreamlike visual storytelling. Create vivid, atmospheric scene descriptions.'
          },
          {
            role: 'user',
            content: storyboardPrompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 500
      })

      const responseContent = storyboardResponse.choices[0].message.content
      console.log('=== GPT-4 STORYBOARD RESPONSE START ===')
      console.log(responseContent)
      console.log('=== GPT-4 STORYBOARD RESPONSE END ===')

      const storyboard = JSON.parse(responseContent || '{}')
      console.log('=== PARSED STORYBOARD OBJECT ===')
      console.log(JSON.stringify(storyboard, null, 2))
      console.log('Fields present:', Object.keys(storyboard))
      console.log('shot1 exists?', !!storyboard.shot1, 'type:', typeof storyboard.shot1)
      console.log('shot2 exists?', !!storyboard.shot2, 'type:', typeof storyboard.shot2)
      console.log('shot3 exists?', !!storyboard.shot3, 'type:', typeof storyboard.shot3)

      if (storyboard.shot1 && storyboard.shot2 && storyboard.shot3) {
        videoPart1 = storyboard.shot1
        videoPart2 = storyboard.shot2
        videoPart3 = storyboard.shot3
        console.log('✅ Successfully generated 3-part storyboard')
        console.log('Shot 1 length:', videoPart1.length)
        console.log('Shot 2 length:', videoPart2.length)
        console.log('Shot 3 length:', videoPart3.length)
      } else {
        console.warn('⚠️ GPT-4 response missing shots, using fallback')
        console.warn('Available fields in response:', Object.keys(storyboard))
        throw new Error('Missing shots in response')
      }
    } catch (error) {
      console.error('Error generating storyboard with GPT-4, using fallback:', error)
      // Fallback to simple string slicing with better prompts
      videoPart1 = `Ethereal dream opening with surreal atmosphere: ${content.slice(0, 150)}. Slow camera movement, soft mystical lighting.`
      videoPart2 = `Dream narrative develops with flowing transitions: ${content.slice(150, 300)}. Evolving dreamscape, gentle movements.`
      videoPart3 = `Dream conclusion with contemplative mood: ${content.slice(300, 450)}. Peaceful atmosphere, dreamlike closure.`
    }

    await supabase
      .from('media_generation_queue')
      .insert({
        entity_type: 'dream',
        entity_id: dream.id,
        user_id: user.id,
        image_prompt: imagePrompt,
        video_prompt_part1: videoPart1,
        video_prompt_part2: videoPart2,
        video_prompt_part3: videoPart3,
        status: 'pending'
      })

    // Trigger background generation (fire and forget)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/media/process-queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error('Failed to trigger media generation:', err))

    // Generate analyses from Jung and Freud
    const serviceSupabase = createServiceClient()

    // Get fine-tuned model IDs from environment (if available)
    const fineTunedModels: Record<string, string> = {
      jung: process.env.OPENAI_JUNG_MODEL || '',
      freud: process.env.OPENAI_FREUD_MODEL || ''
    }

    for (const [analystId, systemPrompt] of Object.entries(ANALYST_PROMPTS)) {
      try {
        // Use fine-tuned model if available, otherwise use gpt-4o with system prompt
        const useFineTunedModel = fineTunedModels[analystId]

        const analysisResponse = await openai.chat.completions.create({
          model: useFineTunedModel || 'gpt-4o',
          messages: useFineTunedModel
            ? [
                // Fine-tuned models don't need system prompts - they're baked in
                {
                  role: 'user',
                  content: `Analyze this dream:\n\nTitle: ${title || 'Untitled'}\n\nDream: ${content}\n\nProvide a detailed analysis (3-4 paragraphs) in your characteristic style and theoretical framework.`
                }
              ]
            : [
                {
                  role: 'system',
                  content: systemPrompt
                },
                {
                  role: 'user',
                  content: `Analyze this dream:\n\nTitle: ${title || 'Untitled'}\n\nDream: ${content}\n\nProvide a detailed analysis (3-4 paragraphs) in your characteristic style and theoretical framework.`
                }
              ],
          temperature: 0.8,
          max_tokens: 800
        })

        const analysisText = analysisResponse.choices[0].message.content

        // Save analysis using service client to bypass RLS
        await serviceSupabase
          .from('dream_analyses')
          .insert({
            dream_id: dream.id,
            analyst_id: analystId,
            analysis: analysisText
          })
      } catch (error) {
        console.error(`Failed to generate ${analystId} analysis:`, error)
        // Continue with other analyses even if one fails
      }
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
