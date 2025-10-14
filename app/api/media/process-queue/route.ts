import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateImage, generateVideoFromImage } from '@/lib/kie-ai/client'
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
 * 2. Generates images with Kie.ai
 * 3. Generates videos from images with Sora 2
 * 4. Downloads and uploads to Supabase Storage
 * 5. Updates entity with media URLs
 */

// GET handler for Vercel Cron
export async function GET() {
  return processQueue()
}

// POST handler for manual triggers
export async function POST() {
  return processQueue()
}

async function processQueue() {
  try {
    const supabase = await createClient()

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

    // Update task status to processing
    await supabase
      .from('media_generation_queue')
      .update({
        status: 'processing',
        attempts: task.attempts + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id)

    try {
      console.log(`Processing media for ${task.entity_type} ${task.entity_id}`)

      // Step 1: Generate image with Kie.ai
      console.log('Generating image...')
      const kieImageUrl = await generateImage(task.image_prompt, '1:1')

      // Step 2: Upload image to Supabase Storage
      console.log('Uploading image to Supabase Storage...')
      let imagePath = ''
      if (task.entity_type === 'dream') {
        imagePath = getDreamImagePath(task.user_id, task.entity_id)
      } else if (task.entity_type === 'manifestation') {
        imagePath = getManifestationImagePath(task.user_id, task.entity_id)
      }

      const imageUrl = await downloadAndUploadToStorage(kieImageUrl, imagePath)

      // Step 3: Generate video from image with Sora 2
      console.log('Generating video...')
      const kieVideoUrl = await generateVideoFromImage(task.video_prompt, kieImageUrl, '10s', 'landscape')

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
      await supabase
        .from(tableName)
        .update({
          image_url: imageUrl,
          video_url: videoUrl,
          media_status: 'completed'
        })
        .eq('id', task.entity_id)

      // Step 6: Mark task as completed
      await supabase
        .from('media_generation_queue')
        .update({
          status: 'completed',
          image_url: imageUrl,
          video_url: videoUrl,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id)

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
  }
}
