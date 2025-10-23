/**
 * Kie.ai API Client
 * Provides methods for image and video generation using Kie.ai APIs
 */

const KIE_AI_BASE_URL = 'https://api.kie.ai'
const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY || 'dummy-key-for-build'

export interface GenerateImageResult {
  imageUrl: string
  taskId: string
}

export interface GenerateVideoResult {
  videoUrl: string
  taskId: string
}

export interface TaskCreatedResult {
  taskId: string
}

interface ImageGenerationResponse {
  code: number
  msg: string
  data: {
    taskId: string
  }
}

interface VideoGenerationResponse {
  code: number
  msg: string
  data: {
    taskId: string
  }
}

interface TaskStatusResponse {
  code: number
  msg: string
  data: {
    taskId: string
    status?: string // Can be "SUCCESS", "PENDING", "GENERATING", "FAILED", etc.
    successFlag?: number // 1 for success
    response?: {
      taskId?: string
      resultUrls?: string[] // Array of result URLs
      originUrls?: string[] // Original URLs (for video)
      resolution?: string // Video resolution (e.g., "1080p")
    }
    errorCode?: string | null
    errorMessage?: string | null
    progress?: string
    fallbackFlag?: boolean
    completeTime?: string
    createTime?: string
  }
}

/**
 * Create image generation task (returns task ID immediately, without polling)
 * @param prompt - Description of the image to generate
 * @param aspectRatio - Aspect ratio (default: '1:1')
 * @returns Task ID for tracking
 */
export async function createImageTask(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'
): Promise<string> {
  const generateResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/gpt4o-image/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIE_AI_API_KEY}`
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: aspectRatio,
      quality: 'standard'
    })
  })

  if (!generateResponse.ok) {
    throw new Error(`Kie.ai image generation failed: ${generateResponse.statusText}`)
  }

  const generateData: ImageGenerationResponse = await generateResponse.json()

  if (generateData.code !== 200) {
    throw new Error(`Kie.ai image generation failed: ${generateData.msg}`)
  }

  const taskId = generateData.data?.taskId

  if (!taskId) {
    throw new Error(`No taskId returned from Kie.ai. Response: ${JSON.stringify(generateData)}`)
  }

  return taskId
}

/**
 * Generate image using Kie.ai 4O Image API
 * @param prompt - Description of the image to generate
 * @param aspectRatio - Aspect ratio (default: '1:1')
 * @returns Image URL and task ID once generation is complete
 */
export async function generateImage(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'
): Promise<GenerateImageResult> {
  try {
    // Create generation task and get task ID
    const taskId = await createImageTask(prompt, aspectRatio)

    // Poll for completion (max 3 minutes)
    const maxAttempts = 90
    const pollInterval = 2000 // 2 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      console.log(`Polling Kie.ai image task status (attempt ${attempt + 1}/${maxAttempts}): ${taskId}`)

      const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/gpt4o-image/record-info?taskId=${taskId}`, {
        headers: {
          'Authorization': `Bearer ${KIE_AI_API_KEY}`
        }
      })

      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.statusText}`)
      }

      const statusData: TaskStatusResponse = await statusResponse.json()

      const currentStatus = statusData.data.status || 'UNKNOWN'
      const progress = statusData.data.progress || '0'
      console.log(`Image task status: ${currentStatus} (${progress}) - Attempt ${attempt + 1}/${maxAttempts}`)

      if (statusData.code !== 200) {
        throw new Error(`Failed to check image task status: ${statusData.msg}`)
      }

      // Check if task is complete (successFlag === 1 or status === "SUCCESS")
      if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
        // Extract image URL from response.resultUrls array
        const imageUrl = statusData.data.response?.resultUrls?.[0]

        if (imageUrl) {
          console.log(`Image generation complete: ${imageUrl}`)
          return { imageUrl, taskId }
        } else {
          console.warn('Task marked as complete but no image URL found. Full response:', JSON.stringify(statusData, null, 2))
          throw new Error('Image generation completed but no URL returned')
        }
      }

      // Check for failure
      if (statusData.data.status === 'FAILED' || statusData.data.errorCode) {
        throw new Error(`Image generation failed: ${statusData.data.errorMessage || 'Unknown error'}`)
      }

    }

    throw new Error('Image generation timed out after 3 minutes')
  } catch (error) {
    console.error('Kie.ai image generation error:', error)
    throw error
  }
}

/**
 * Poll for image task completion
 * @param taskId - The Kie.ai task ID to poll
 * @param maxAttempts - Maximum number of polling attempts (default: 90)
 * @param pollInterval - Interval between polls in milliseconds (default: 2000)
 * @returns Image URL once complete
 */
export async function pollImageTask(
  taskId: string,
  maxAttempts: number = 90,
  pollInterval: number = 2000
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, pollInterval))

    console.log(`Polling Kie.ai image task status (attempt ${attempt + 1}/${maxAttempts}): ${taskId}`)

    const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/gpt4o-image/record-info?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`
      }
    })

    if (!statusResponse.ok) {
      throw new Error(`Failed to check task status: ${statusResponse.statusText}`)
    }

    const statusData: TaskStatusResponse = await statusResponse.json()

    const currentStatus = statusData.data.status || 'UNKNOWN'
    const progress = statusData.data.progress || '0'
    console.log(`Image task status: ${currentStatus} (${progress}) - Attempt ${attempt + 1}/${maxAttempts}`)

    if (statusData.code !== 200) {
      throw new Error(`Failed to check image task status: ${statusData.msg}`)
    }

    // Check if task is complete
    if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
      const imageUrl = statusData.data.response?.resultUrls?.[0]

      if (imageUrl) {
        console.log(`Image generation complete: ${imageUrl}`)
        return imageUrl
      } else {
        console.warn('Task marked as complete but no image URL found. Full response:', JSON.stringify(statusData, null, 2))
        throw new Error('Image generation completed but no URL returned')
      }
    }

    // Check for failure
    if (statusData.data.status === 'FAILED' || statusData.data.errorCode) {
      throw new Error(`Image generation failed: ${statusData.data.errorMessage || 'Unknown error'}`)
    }
  }

  throw new Error('Image generation timed out after 3 minutes')
}

/**
 * Check status of existing image task (for recovery from polling failures)
 * @param taskId - The Kie.ai task ID to check
 * @returns Image URL if task completed, null if still pending/failed
 */
export async function checkImageTaskStatus(taskId: string): Promise<string | null> {
  try {
    console.log(`Checking existing image task status: ${taskId}`)

    const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/gpt4o-image/record-info?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`
      }
    })

    if (!statusResponse.ok) {
      console.warn(`Failed to check image task ${taskId}: ${statusResponse.statusText}`)
      return null
    }

    const statusData: TaskStatusResponse = await statusResponse.json()

    if (statusData.code !== 200) {
      console.warn(`Image task status check returned non-200: ${statusData.msg}`)
      return null
    }

    // Check if task completed successfully
    if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
      const imageUrl = statusData.data.response?.resultUrls?.[0]
      if (imageUrl) {
        console.log(`✅ Recovered completed image task ${taskId}: ${imageUrl}`)
        return imageUrl
      }
    }

    // Task still pending or failed
    console.log(`Image task ${taskId} status: ${statusData.data.status}`)
    return null
  } catch (error) {
    console.error(`Error checking image task ${taskId}:`, error)
    return null
  }
}

/**
 * Create storyboard video task (returns task ID immediately, without polling)
 * @param prompts - Array of 3 prompts for beginning, middle, and end
 * @param imageUrl - URL of the source image
 * @param aspectRatio - Video aspect ratio ('portrait' or 'landscape')
 * @returns Task ID for tracking
 */
export async function createStoryboardVideoTask(
  prompts: [string, string, string],
  imageUrl: string,
  aspectRatio: 'portrait' | 'landscape' = 'landscape'
): Promise<string> {
  const generateResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIE_AI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'sora-2-pro-storyboard',
      input: {
        n_frames: '15',
        image_urls: [imageUrl],
        aspect_ratio: aspectRatio,
        shots: [
          {
            Scene: prompts[0],
            duration: 5
          },
          {
            Scene: prompts[1],
            duration: 5
          },
          {
            Scene: prompts[2],
            duration: 5
          }
        ]
      }
    })
  })

  if (!generateResponse.ok) {
    throw new Error(`Kie.ai storyboard generation failed: ${generateResponse.statusText}`)
  }

  const generateData: VideoGenerationResponse = await generateResponse.json()

  console.log('Kie.ai storyboard generation response:', JSON.stringify(generateData, null, 2))

  if (generateData.code !== 200) {
    throw new Error(`Kie.ai storyboard generation failed: ${generateData.msg}`)
  }

  const taskId = generateData.data?.taskId

  if (!taskId) {
    throw new Error(`No taskId returned from Kie.ai. Response: ${JSON.stringify(generateData)}`)
  }

  return taskId
}

/**
 * Generate storyboard video using Kie.ai Sora 2 Pro Storyboard API
 * Creates a 15-second video from 3 prompts (5 seconds each)
 * @param prompts - Array of 3 prompts for beginning, middle, and end
 * @param imageUrl - URL of the source image
 * @param aspectRatio - Video aspect ratio ('portrait' or 'landscape')
 * @returns Video URL and task ID once generation is complete
 */
export async function generateStoryboardVideo(
  prompts: [string, string, string],
  imageUrl: string,
  aspectRatio: 'portrait' | 'landscape' = 'landscape'
): Promise<GenerateVideoResult> {
  try {
    // Create storyboard video generation task and get task ID
    const taskId = await createStoryboardVideoTask(prompts, imageUrl, aspectRatio)

    // Poll for completion (max 10 minutes for longer video generation)
    const maxAttempts = 120
    const pollInterval = 5000 // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      console.log(`Polling Kie.ai storyboard task status (attempt ${attempt + 1}/${maxAttempts}): ${taskId}`)

      const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/jobs/task-info?taskId=${taskId}`, {
        headers: {
          'Authorization': `Bearer ${KIE_AI_API_KEY}`
        }
      })

      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.statusText}`)
      }

      const statusData: TaskStatusResponse = await statusResponse.json()

      const currentStatus = statusData.data.status || 'UNKNOWN'
      const progress = statusData.data.progress || '0'
      console.log(`Storyboard task status: ${currentStatus} (${progress}) - Attempt ${attempt + 1}/${maxAttempts}`)

      if (statusData.code !== 200) {
        throw new Error(`Failed to check storyboard task status: ${statusData.msg}`)
      }

      // Check if task is complete (successFlag === 1 or status === "SUCCESS")
      if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
        // Extract video URL from response.resultUrls array
        const videoUrl = statusData.data.response?.resultUrls?.[0]

        if (videoUrl) {
          console.log(`Storyboard video generation complete: ${videoUrl}`)
          return { videoUrl, taskId }
        } else {
          console.warn('Task marked as complete but no video URL found. Full response:', JSON.stringify(statusData, null, 2))
          throw new Error('Storyboard video generation completed but no URL returned')
        }
      }

      // Check for failure
      if (statusData.data.status === 'FAILED' || statusData.data.errorCode) {
        throw new Error(`Storyboard video generation failed: ${statusData.data.errorMessage || 'Unknown error'}`)
      }
    }

    throw new Error('Storyboard video generation timed out after 10 minutes')
  } catch (error) {
    console.error('Kie.ai storyboard generation error:', error)
    throw error
  }
}

/**
 * Poll for storyboard video task completion
 * @param taskId - The Kie.ai task ID to poll
 * @param maxAttempts - Maximum number of polling attempts (default: 120)
 * @param pollInterval - Interval between polls in milliseconds (default: 5000)
 * @returns Video URL once complete
 */
export async function pollStoryboardTask(
  taskId: string,
  maxAttempts: number = 120,
  pollInterval: number = 5000
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, pollInterval))

    console.log(`Polling Kie.ai storyboard task status (attempt ${attempt + 1}/${maxAttempts}): ${taskId}`)

    const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/jobs/task-info?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`
      }
    })

    if (!statusResponse.ok) {
      throw new Error(`Failed to check task status: ${statusResponse.statusText}`)
    }

    const statusData: TaskStatusResponse = await statusResponse.json()

    const currentStatus = statusData.data.status || 'UNKNOWN'
    const progress = statusData.data.progress || '0'
    console.log(`Storyboard task status: ${currentStatus} (${progress}) - Attempt ${attempt + 1}/${maxAttempts}`)

    if (statusData.code !== 200) {
      throw new Error(`Failed to check storyboard task status: ${statusData.msg}`)
    }

    // Check if task is complete
    if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
      const videoUrl = statusData.data.response?.resultUrls?.[0]

      if (videoUrl) {
        console.log(`Storyboard video generation complete: ${videoUrl}`)
        return videoUrl
      } else {
        console.warn('Task marked as complete but no video URL found. Full response:', JSON.stringify(statusData, null, 2))
        throw new Error('Storyboard video generation completed but no URL returned')
      }
    }

    // Check for failure
    if (statusData.data.status === 'FAILED' || statusData.data.errorCode) {
      throw new Error(`Storyboard video generation failed: ${statusData.data.errorMessage || 'Unknown error'}`)
    }
  }

  throw new Error('Storyboard video generation timed out after 10 minutes')
}

/**
 * Check status of existing storyboard video task (for recovery from polling failures)
 * @param taskId - The Kie.ai task ID to check
 * @returns Video URL if task completed, null if still pending/failed
 */
export async function checkStoryboardTaskStatus(taskId: string): Promise<string | null> {
  try {
    console.log(`Checking existing storyboard task status: ${taskId}`)

    const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/jobs/task-info?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`
      }
    })

    if (!statusResponse.ok) {
      console.warn(`Failed to check storyboard task ${taskId}: ${statusResponse.statusText}`)
      return null
    }

    const statusData: TaskStatusResponse = await statusResponse.json()

    if (statusData.code !== 200) {
      console.warn(`Storyboard task status check returned non-200: ${statusData.msg}`)
      return null
    }

    // Check if task completed successfully
    if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
      const videoUrl = statusData.data.response?.resultUrls?.[0]
      if (videoUrl) {
        console.log(`✅ Recovered completed storyboard task ${taskId}: ${videoUrl}`)
        return videoUrl
      }
    }

    // Task still pending or failed
    console.log(`Storyboard task ${taskId} status: ${statusData.data.status}`)
    return null
  } catch (error) {
    console.error(`Error checking storyboard task ${taskId}:`, error)
    return null
  }
}

/**
 * Create Veo3 video task (returns task ID immediately, without polling)
 * @param prompt - Description of the video motion/animation
 * @param imageUrl - URL of the source image
 * @param aspectRatio - Video aspect ratio ('16:9' or '9:16')
 * @returns Task ID for tracking
 */
export async function createVeo3VideoTask(
  prompt: string,
  imageUrl: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> {
  const generateResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/veo/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIE_AI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'veo3_fast',
      prompt,
      imageUrls: [imageUrl],
      aspectRatio: aspectRatio,
      enableFallback: true,
      enableTranslation: true
    })
  })

  if (!generateResponse.ok) {
    throw new Error(`Kie.ai video generation failed: ${generateResponse.statusText}`)
  }

  const generateData: VideoGenerationResponse = await generateResponse.json()

  console.log('Kie.ai video generation response:', JSON.stringify(generateData, null, 2))

  if (generateData.code !== 200) {
    throw new Error(`Kie.ai video generation failed: ${generateData.msg}`)
  }

  const taskId = generateData.data?.taskId

  if (!taskId) {
    throw new Error(`No taskId returned from Kie.ai. Response: ${JSON.stringify(generateData)}`)
  }

  return taskId
}

/**
 * Generate video from image using Kie.ai Veo3 Fast API
 * @param prompt - Description of the video motion/animation
 * @param imageUrl - URL of the source image
 * @param aspectRatio - Video aspect ratio ('16:9' or '9:16')
 * @returns Video URL and task ID once generation is complete
 */
export async function generateVideoFromImage(
  prompt: string,
  imageUrl: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<GenerateVideoResult> {
  try {
    // Create video generation task and get task ID
    const taskId = await createVeo3VideoTask(prompt, imageUrl, aspectRatio)

    // Poll for completion (max 5 minutes for video generation)
    const maxAttempts = 60
    const pollInterval = 5000 // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      console.log(`Polling Kie.ai video task status (attempt ${attempt + 1}/${maxAttempts}): ${taskId}`)

      const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/veo/record-info?taskId=${taskId}`, {
        headers: {
          'Authorization': `Bearer ${KIE_AI_API_KEY}`
        }
      })

      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.statusText}`)
      }

      const statusData: TaskStatusResponse = await statusResponse.json()

      const currentStatus = statusData.data.status || 'UNKNOWN'
      const progress = statusData.data.progress || '0'
      console.log(`Video task status: ${currentStatus} (${progress}) - Attempt ${attempt + 1}/${maxAttempts}`)

      if (statusData.code !== 200) {
        throw new Error(`Failed to check video task status: ${statusData.msg}`)
      }

      // Check if task is complete (successFlag === 1 or status === "SUCCESS")
      if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
        // Extract video URL from response.resultUrls array
        const videoUrl = statusData.data.response?.resultUrls?.[0]

        if (videoUrl) {
          console.log(`Video generation complete: ${videoUrl}`)
          return { videoUrl, taskId }
        } else {
          console.warn('Task marked as complete but no video URL found. Full response:', JSON.stringify(statusData, null, 2))
          throw new Error('Video generation completed but no URL returned')
        }
      }

      // Check for failure
      if (statusData.data.status === 'FAILED' || statusData.data.errorCode) {
        throw new Error(`Video generation failed: ${statusData.data.errorMessage || 'Unknown error'}`)
      }
    }

    throw new Error('Video generation timed out after 5 minutes')
  } catch (error) {
    console.error('Kie.ai video generation error:', error)
    throw error
  }
}

/**
 * Check status of existing Veo3 video task (for recovery from polling failures)
 * @param taskId - The Kie.ai task ID to check
 * @returns Video URL if task completed, null if still pending/failed
 */
export async function checkVeo3TaskStatus(taskId: string): Promise<string | null> {
  try {
    console.log(`Checking existing Veo3 task status: ${taskId}`)

    const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/veo/record-info?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`
      }
    })

    if (!statusResponse.ok) {
      console.warn(`Failed to check Veo3 task ${taskId}: ${statusResponse.statusText}`)
      return null
    }

    const statusData: TaskStatusResponse = await statusResponse.json()

    if (statusData.code !== 200) {
      console.warn(`Veo3 task status check returned non-200: ${statusData.msg}`)
      return null
    }

    // Check if task completed successfully
    if (statusData.data.successFlag === 1 || statusData.data.status === 'SUCCESS') {
      const videoUrl = statusData.data.response?.resultUrls?.[0]
      if (videoUrl) {
        console.log(`✅ Recovered completed Veo3 task ${taskId}: ${videoUrl}`)
        return videoUrl
      }
    }

    // Task still pending or failed
    console.log(`Veo3 task ${taskId} status: ${statusData.data.status}`)
    return null
  } catch (error) {
    console.error(`Error checking Veo3 task ${taskId}:`, error)
    return null
  }
}
