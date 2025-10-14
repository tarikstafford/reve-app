import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Get dream status including media generation progress
 * Used by frontend to poll for media completion
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch dream with media status
    const { data: dream, error: dreamError } = await supabase
      .from('dreams')
      .select('id, media_status, image_url, video_url, title, content, interpretation')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (dreamError || !dream) {
      return NextResponse.json(
        { success: false, error: 'Dream not found' },
        { status: 404 }
      )
    }

    // Check queue status if media is pending/processing
    let queueStatus = null
    if (dream.media_status === 'pending' || dream.media_status === 'processing') {
      const { data: queueTask } = await supabase
        .from('media_generation_queue')
        .select('status, attempts, error_message, updated_at')
        .eq('entity_type', 'dream')
        .eq('entity_id', id)
        .single()

      queueStatus = queueTask
    }

    return NextResponse.json({
      success: true,
      dream: {
        id: dream.id,
        title: dream.title,
        content: dream.content,
        interpretation: dream.interpretation,
        mediaStatus: dream.media_status,
        imageUrl: dream.image_url,
        videoUrl: dream.video_url,
        queueStatus
      }
    })
  } catch (error) {
    console.error('Error fetching dream status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dream status' },
      { status: 500 }
    )
  }
}
