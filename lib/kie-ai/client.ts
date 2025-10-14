/**
 * Kie.ai API Client
 * Provides methods for image and video generation using Kie.ai APIs
 */

const KIE_AI_BASE_URL = 'https://api.kie.ai'
const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY || 'dummy-key-for-build'

interface ImageGenerationResponse {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  imageUrl?: string
  error?: string
}

interface VideoGenerationResponse {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  error?: string
}

interface TaskStatusResponse {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    imageUrl?: string
    videoUrl?: string
  }
  error?: string
}

/**
 * Generate image using Kie.ai 4O Image API
 * @param prompt - Description of the image to generate
 * @param aspectRatio - Aspect ratio (default: '1:1')
 * @returns Image URL once generation is complete
 */
export async function generateImage(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'
): Promise<string> {
  try {
    // Create generation task
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
    const taskId = generateData.taskId

    // Poll for completion (max 60 seconds)
    const maxAttempts = 30
    const pollInterval = 2000 // 2 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/task/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${KIE_AI_API_KEY}`
        }
      })

      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.statusText}`)
      }

      const statusData: TaskStatusResponse = await statusResponse.json()

      if (statusData.status === 'completed' && statusData.result?.imageUrl) {
        return statusData.result.imageUrl
      }

      if (statusData.status === 'failed') {
        throw new Error(`Image generation failed: ${statusData.error || 'Unknown error'}`)
      }
    }

    throw new Error('Image generation timed out after 60 seconds')
  } catch (error) {
    console.error('Kie.ai image generation error:', error)
    throw error
  }
}

/**
 * Generate video from image using Kie.ai Sora 2 API
 * @param prompt - Description of the video motion/animation
 * @param imageUrl - URL of the source image
 * @param duration - Video duration ('10s' or '15s')
 * @param aspectRatio - Video aspect ratio
 * @returns Video URL once generation is complete
 */
export async function generateVideoFromImage(
  prompt: string,
  imageUrl: string,
  duration: '10s' | '15s' = '10s',
  aspectRatio: 'landscape' | 'portrait' = 'landscape'
): Promise<string> {
  try {
    // Create video generation task
    const generateResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/sora2/image-to-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_AI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        image_urls: [imageUrl],
        n_frames: duration,
        aspect_ratio: aspectRatio,
        remove_watermark: true,
        size: 'standard'
      })
    })

    if (!generateResponse.ok) {
      throw new Error(`Kie.ai video generation failed: ${generateResponse.statusText}`)
    }

    const generateData: VideoGenerationResponse = await generateResponse.json()
    const taskId = generateData.taskId

    // Poll for completion (max 5 minutes for video generation)
    const maxAttempts = 60
    const pollInterval = 5000 // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval))

      const statusResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/task/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${KIE_AI_API_KEY}`
        }
      })

      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.statusText}`)
      }

      const statusData: TaskStatusResponse = await statusResponse.json()

      if (statusData.status === 'completed' && statusData.result?.videoUrl) {
        return statusData.result.videoUrl
      }

      if (statusData.status === 'failed') {
        throw new Error(`Video generation failed: ${statusData.error || 'Unknown error'}`)
      }
    }

    throw new Error('Video generation timed out after 5 minutes')
  } catch (error) {
    console.error('Kie.ai video generation error:', error)
    throw error
  }
}
