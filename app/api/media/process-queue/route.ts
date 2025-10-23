import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import {
  createImageTask,
  createStoryboardVideoTask,
  createVeo3VideoTask,
  pollImageTask,
  pollStoryboardTask,
  checkImageTaskStatus,
  checkStoryboardTaskStatus,
  checkVeo3TaskStatus
} from '@/lib/kie-ai/client'
import {
  downloadAndUploadToStorage,
  getDreamImagePath,
  getDreamVideoPath,
  getManifestationImagePath,
  getManifestationVideoPath
} from '@/lib/storage/upload'

/**
 * Background Media Generation Queue Processor
 *
 * Processes pending media generation tasks:
 * 1. Fetches pending tasks from queue
 * 2. Generates images with Kie.ai 4O Image API
 * 3. Generates videos from images with Kie.ai Veo3 API
 * 4. Downloads and uploads to Supabase Storage
 * 5. Updates entity with media URLs
 */

// Increase timeout for long-running media generation (max 5 minutes on Hobby plan)
export const maxDuration = 300 // 5 minutes

// GET handler for Vercel Cron
export async function GET() {
  console.log('🔄 Media processor triggered by CRON')
  return processQueue()
}

// POST handler for manual triggers
export async function POST() {
  console.log('🔄 Media processor triggered by MANUAL call')
  return processQueue()
}

async function processQueue() {
  const startTime = Date.now()
  console.log(`=== MEDIA PROCESSOR STARTED at ${new Date().toISOString()} ===`)

  try {
    const supabase = createServiceClient()

    // First, reset stuck "processing" tasks (been processing for >10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    await supabase
      .from('media_generation_queue')
      .update({ status: 'pending' })
      .eq('status', 'processing')
      .lt('updated_at', tenMinutesAgo)
      .lt('attempts', 3)

    // Get next pending task (FIFO)
    const { data: tasks, error: fetchError } = await supabase
      .from('media_generation_queue')
      .select('*')
      .eq('status', 'pending')
      .lt('attempts', 3) // Max 3 attempts
      .order('created_at', { ascending: true })
      .limit(1)

    if (fetchError) {
      console.error('Error fetching queue:', fetchError)
      return NextResponse.json({ success: false, error: 'Failed to fetch queue' }, { status: 500 })
    }

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending tasks' })
    }

    const task = tasks[0]

    console.log(`Found pending task: ${task.id} for ${task.entity_type} ${task.entity_id}`)
    console.log(`Task attempts: ${task.attempts}/3, current status: ${task.status}`)

    // Update task status to processing with optimistic locking
    // Only update if status is still 'pending' to prevent race conditions
    const { data: updatedTask, error: updateError } = await supabase
      .from('media_generation_queue')
      .update({
        status: 'processing',
        attempts: task.attempts + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id)
      .eq('status', 'pending') // Only update if still pending
      .select()
      .single()

    if (updateError || !updatedTask) {
      console.warn(`Task ${task.id} was already picked up by another worker, skipping`)
      return NextResponse.json({ success: true, message: 'Task already being processed' })
    }

    console.log(`✅ Task ${task.id} locked for processing`)

    try {
      console.log(`Processing media for ${task.entity_type} ${task.entity_id}`)

      // Step 1: Check if we have an existing image task to recover
      let kieImageUrl: string
      let imageTaskId: string

      if (task.kie_image_task_id) {
        console.log(`Found existing image task ID: ${task.kie_image_task_id}, checking status...`)
        const recoveredImageUrl = await checkImageTaskStatus(task.kie_image_task_id)
        if (recoveredImageUrl) {
          kieImageUrl = recoveredImageUrl
          imageTaskId = task.kie_image_task_id
          console.log('✅ Recovered image from existing task')
        } else {
          console.log('⚠️ Existing image task not ready, will poll it now...')
          imageTaskId = task.kie_image_task_id
          kieImageUrl = await pollImageTask(imageTaskId)
        }
      } else {
        // Create new image task and save task ID immediately BEFORE polling
        console.log('Creating image generation task...')
        imageTaskId = await createImageTask(task.image_prompt, '1:1')

        console.log(`✅ Image task created: ${imageTaskId}, saving to queue...`)
        await supabase
          .from('media_generation_queue')
          .update({ kie_image_task_id: imageTaskId })
          .eq('id', task.id)

        // Now poll for completion
        console.log('Polling for image completion...')
        kieImageUrl = await pollImageTask(imageTaskId)
      }

      // Step 2: Upload image to Supabase Storage
      console.log('Uploading image to Supabase Storage...')
      let imagePath = ''
      if (task.entity_type === 'dream') {
        imagePath = getDreamImagePath(task.user_id, task.entity_id)
      } else if (task.entity_type === 'manifestation') {
        imagePath = getManifestationImagePath(task.user_id, task.entity_id)
      }

      const imageUrl = await downloadAndUploadToStorage(kieImageUrl, imagePath)

      // Step 3: Check if we have an existing video task to recover, or generate new video
      console.log('Generating video...')
      console.log('Task prompts check:', {
        has_part1: !!task.video_prompt_part1,
        has_part2: !!task.video_prompt_part2,
        has_part3: !!task.video_prompt_part3,
        has_legacy: !!task.video_prompt,
        has_existing_task: !!task.kie_video_task_id,
        part1_preview: task.video_prompt_part1?.slice(0, 50),
        part2_preview: task.video_prompt_part2?.slice(0, 50),
        part3_preview: task.video_prompt_part3?.slice(0, 50)
      })
      let kieVideoUrl: string
      let videoTaskId: string

      // Try to recover existing video task first
      if (task.kie_video_task_id) {
        console.log(`Found existing video task ID: ${task.kie_video_task_id}, checking status...`)
        const usesStoryboard = task.video_prompt_part1 && task.video_prompt_part2 && task.video_prompt_part3
        const recoveredVideoUrl = usesStoryboard
          ? await checkStoryboardTaskStatus(task.kie_video_task_id)
          : await checkVeo3TaskStatus(task.kie_video_task_id)

        if (recoveredVideoUrl) {
          kieVideoUrl = recoveredVideoUrl
          videoTaskId = task.kie_video_task_id
          console.log('✅ Recovered video from existing task')
        } else {
          console.log('⚠️ Existing video task not ready, will poll it now...')
          videoTaskId = task.kie_video_task_id
          if (usesStoryboard) {
            kieVideoUrl = await pollStoryboardTask(videoTaskId)
          } else {
            // For Veo3, we'll use checkVeo3TaskStatus in a loop since we don't have pollVeo3Task yet
            throw new Error('Veo3 polling not yet implemented - will retry on next run')
          }
        }
      } else {
        // Create new video task and save task ID immediately BEFORE polling
        if (task.video_prompt_part1 && task.video_prompt_part2 && task.video_prompt_part3) {
          // Use Sora 2 Pro Storyboard for 3-part narrative (15 seconds)
          console.log('✅ Creating Sora 2 Pro Storyboard task (3 parts, 15 seconds)')
          console.log('Shot 1:', task.video_prompt_part1)
          console.log('Shot 2:', task.video_prompt_part2)
          console.log('Shot 3:', task.video_prompt_part3)

          videoTaskId = await createStoryboardVideoTask(
            [task.video_prompt_part1, task.video_prompt_part2, task.video_prompt_part3],
            kieImageUrl,
            'landscape'
          )

          console.log(`✅ Storyboard video task created: ${videoTaskId}, saving to queue...`)
          await supabase
            .from('media_generation_queue')
            .update({ kie_video_task_id: videoTaskId })
            .eq('id', task.id)

          console.log('Polling for storyboard video completion...')
          kieVideoUrl = await pollStoryboardTask(videoTaskId)
        } else if (task.video_prompt) {
          // Fallback to Veo3 for legacy single-prompt videos
          console.log('⚠️ Creating Veo3 Fast task (legacy single prompt)')

          videoTaskId = await createVeo3VideoTask(task.video_prompt, kieImageUrl, '16:9')

          console.log(`✅ Veo3 video task created: ${videoTaskId}, saving to queue...`)
          await supabase
            .from('media_generation_queue')
            .update({ kie_video_task_id: videoTaskId })
            .eq('id', task.id)

          // For now, throw error to retry later since we don't have pollVeo3Task
          throw new Error('Veo3 task created but polling not yet implemented - will retry on next run')
        } else {
          throw new Error('No video prompts found in task')
        }
      }

      // Step 4: Upload video to Supabase Storage
      console.log('Uploading video to Supabase Storage...')
      let videoPath = ''
      if (task.entity_type === 'dream') {
        videoPath = getDreamVideoPath(task.user_id, task.entity_id)
      } else if (task.entity_type === 'manifestation') {
        videoPath = getManifestationVideoPath(task.user_id, task.entity_id)
      }

      const videoUrl = await downloadAndUploadToStorage(kieVideoUrl, videoPath)

      // Step 5: Update entity with media URLs
      console.log('Updating entity with media URLs...')
      const tableName = task.entity_type === 'dream' ? 'dreams' : 'manifestations'
      const { error: updateError } = await supabase
        .from(tableName)
        .update({
          image_url: imageUrl,
          video_url: videoUrl,
          media_status: 'completed'
        })
        .eq('id', task.entity_id)

      if (updateError) {
        console.error(`Failed to update ${tableName} with media URLs:`, updateError)
        throw new Error(`Failed to update ${tableName}: ${updateError.message}`)
      }

      console.log(`Successfully updated ${tableName} ${task.entity_id} with media URLs`)

      // Step 6: Mark task as completed with Kie task IDs
      const { error: queueUpdateError } = await supabase
        .from('media_generation_queue')
        .update({
          status: 'completed',
          image_url: imageUrl,
          video_url: videoUrl,
          kie_image_task_id: imageTaskId,
          kie_video_task_id: videoTaskId,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id)

      if (queueUpdateError) {
        console.error('Failed to update queue task:', queueUpdateError)
        // Don't throw - entity was updated successfully, queue update is less critical
      }

      console.log(`Successfully processed media for ${task.entity_type} ${task.entity_id}`)

      // Trigger next task if there are more in queue
      const { data: nextTasks } = await supabase
        .from('media_generation_queue')
        .select('id')
        .eq('status', 'pending')
        .limit(1)

      if (nextTasks && nextTasks.length > 0) {
        // Trigger self to process next task (fire and forget)
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/media/process-queue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.error('Failed to trigger next task:', err))
      }

      return NextResponse.json({
        success: true,
        message: 'Media generated successfully',
        taskId: task.id,
        imageUrl,
        videoUrl
      })

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error generating media:', error)

      // Mark task as failed
      await supabase
        .from('media_generation_queue')
        .update({
          status: task.attempts + 1 >= 3 ? 'failed' : 'pending', // Retry if under 3 attempts
          error_message: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id)

      // Also update entity status
      const tableName = task.entity_type === 'dream' ? 'dreams' : 'manifestations'
      await supabase
        .from(tableName)
        .update({ media_status: 'failed' })
        .eq('id', task.entity_id)

      return NextResponse.json({
        success: false,
        error: errorMessage,
        taskId: task.id
      }, { status: 500 })
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Queue processor error:', error)
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  } finally {
    const duration = Date.now() - startTime
    console.log(`=== MEDIA PROCESSOR COMPLETED in ${duration}ms at ${new Date().toISOString()} ===`)
  }
}
