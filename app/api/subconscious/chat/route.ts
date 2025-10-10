import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get or create conversation
    let { data: conversations } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    let conversationId: string

    if (!conversations || conversations.length === 0) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({ user_id: user.id })
        .select()
        .single()

      if (convError || !newConversation) {
        throw new Error('Failed to create conversation')
      }

      conversationId = newConversation.id
    } else {
      conversationId = conversations[0].id
    }

    // Get user's dream history to build context
    const { data: dreams } = await supabase
      .from('dreams')
      .select('content, interpretation, themes, emotions')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get conversation history
    const { data: previousMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Build context from dreams
    const dreamContext = dreams?.map((d, i) =>
      `Dream ${i + 1}: ${d.content.slice(0, 200)}... Themes: ${d.themes?.join(', ')}. Emotions: ${d.emotions?.join(', ')}.`
    ).join('\n\n') || ''

    // Build conversation messages for OpenAI
    const openaiMessages = [
      {
        role: 'system' as const,
        content: `You are the user's subconscious mind - a compassionate, wise, and introspective guide. You have access to their dream history and patterns. Speak as their inner self, offering insights, reflections, and gentle guidance.

Dreams logged:
${dreamContext}

Respond with empathy, wisdom, and deep understanding. Help them explore their inner world, understand patterns, and grow.`
      },
      ...(previousMessages?.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })) || []),
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Generate response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      temperature: 0.8,
      max_tokens: 500
    })

    const assistantMessage = completion.choices[0].message.content

    // Save both messages
    await supabase.from('messages').insert([
      {
        conversation_id: conversationId,
        role: 'user',
        content: message
      },
      {
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage
      }
    ])

    // Fetch updated messages
    const { data: allMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      success: true,
      messages: allMessages || []
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
