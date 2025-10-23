import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import {
  checkImageTaskStatus,
  checkStoryboardTaskStatus,
  checkVeo3TaskStatus
} from '@/lib/kie-ai/client'
import {
  downloadAndUploadToStorage,
  getDreamImagePath,
  getDreamVideoPath
} from '@/lib/storage/upload'

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

    // Fetch user's dreams
    const { data: dreams, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching dreams:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch dreams' },
        { status: 500 }
      )
    }

    // Check for pending/processing dreams and attempt recovery
    const serviceSupabase = createServiceClient()
    const recoveryPromises = (dreams || [])
      .filter(dream => dream.media_status === 'pending' || dream.media_status === 'processing')
      .map(async (dream) => {
        try {
          console.log(`Checking recovery options for dream ${dream.id} with status ${dream.media_status}`)

          // Get queue entry for this dream
          const { data: queueTask } = await serviceSupabase
            .from('media_generation_queue')
            .select('*')
            .eq('entity_type', 'dream')
            .eq('entity_id', dream.id)
            .single()

          if (!queueTask) {
            console.log(`No queue task found for dream ${dream.id}`)
            return
          }

          let imageRecovered = false
          let videoRecovered = false
          let kieImageUrl: string | null = null
          let kieVideoUrl: string | null = null

          // Try to recover image if we have a task ID but no final image URL in dream or queue
          if (queueTask.kie_image_task_id && (!dream.image_url || !queueTask.image_url)) {
            kieImageUrl = await checkImageTaskStatus(queueTask.kie_image_task_id)
            if (kieImageUrl) {
              console.log(`✅ Recovered image for dream ${dream.id}`)
              imageRecovered = true
            }
          }

          // Try to recover video if we have a task ID but no final video URL in dream or queue
          if (queueTask.kie_video_task_id && (!dream.video_url || !queueTask.video_url)) {
            const usesStoryboard = queueTask.video_prompt_part1 && queueTask.video_prompt_part2 && queueTask.video_prompt_part3
            kieVideoUrl = usesStoryboard
              ? await checkStoryboardTaskStatus(queueTask.kie_video_task_id)
              : await checkVeo3TaskStatus(queueTask.kie_video_task_id)

            if (kieVideoUrl) {
              console.log(`✅ Recovered video for dream ${dream.id}`)
              videoRecovered = true
            }
          }

          // If we recovered any media, upload to storage and update dream
          if (imageRecovered || videoRecovered) {
            const updates: Record<string, string> = {}

            if (imageRecovered && kieImageUrl) {
              const imagePath = getDreamImagePath(user.id, dream.id)
              const imageUrl = await downloadAndUploadToStorage(kieImageUrl, imagePath)
              updates.image_url = imageUrl
              console.log(`Uploaded recovered image for dream ${dream.id}`)
            }

            if (videoRecovered && kieVideoUrl) {
              const videoPath = getDreamVideoPath(user.id, dream.id)
              const videoUrl = await downloadAndUploadToStorage(kieVideoUrl, videoPath)
              updates.video_url = videoUrl
              console.log(`Uploaded recovered video for dream ${dream.id}`)
            }

            // Update dream with recovered media
            if (Object.keys(updates).length > 0) {
              // Check if we have both image and video now
              const hasImage = updates.image_url || dream.image_url
              const hasVideo = updates.video_url || dream.video_url
              if (hasImage && hasVideo) {
                updates.media_status = 'completed'
              }

              await serviceSupabase
                .from('dreams')
                .update(updates)
                .eq('id', dream.id)

              // Update queue task
              await serviceSupabase
                .from('media_generation_queue')
                .update({
                  status: updates.media_status === 'completed' ? 'completed' : 'processing',
                  image_url: updates.image_url || queueTask.image_url,
                  video_url: updates.video_url || queueTask.video_url,
                  updated_at: new Date().toISOString()
                })
                .eq('id', queueTask.id)

              console.log(`✅ Updated dream ${dream.id} with recovered media`)

              // Update the dream in our results
              Object.assign(dream, updates)
            }
          }
        } catch (error) {
          console.error(`Error attempting recovery for dream ${dream.id}:`, error)
          // Don't throw - continue with other dreams
        }
      })

    // Wait for all recovery attempts
    await Promise.all(recoveryPromises)

    return NextResponse.json({
      success: true,
      dreams: dreams || []
    })
  } catch (error) {
    console.error('Error in dreams API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
