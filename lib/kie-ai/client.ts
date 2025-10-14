/**
 * Kie.ai API Client
 * Provides methods for image and video generation using Kie.ai APIs
 */

const KIE_AI_BASE_URL = 'https://api.kie.ai'
const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY || 'dummy-key-for-build'

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
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'success'
    imageUrl?: string
    videoUrl?: string
    error?: string
  }
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

    console.log('Kie.ai image generation response:', JSON.stringify(generateData, null, 2))

    if (generateData.code !== 200) {
      throw new Error(`Kie.ai image generation failed: ${generateData.msg}`)
    }

    const taskId = generateData.data?.taskId

    if (!taskId) {
      throw new Error(`No taskId returned from Kie.ai. Response: ${JSON.stringify(generateData)}`)
    }

    // Poll for completion (max 60 seconds)
    const maxAttempts = 30
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

      console.log(`Image task status response:`, JSON.stringify(statusData, null, 2))

      if (statusData.code !== 200) {
        throw new Error(`Failed to check image task status: ${statusData.msg}`)
      }

      if ((statusData.data.status === 'completed' || statusData.data.status === 'success') && statusData.data.imageUrl) {
        console.log(`Image generation complete: ${statusData.data.imageUrl}`)
        return statusData.data.imageUrl
      }

      if (statusData.data.status === 'failed') {
        throw new Error(`Image generation failed: ${statusData.data.error || 'Unknown error'}`)
      }
    }

    throw new Error('Image generation timed out after 60 seconds')
  } catch (error) {
    console.error('Kie.ai image generation error:', error)
    throw error
  }
}

/**
 * Generate video from image using Kie.ai Veo3 API
 * @param prompt - Description of the video motion/animation
 * @param imageUrl - URL of the source image
 * @param aspectRatio - Video aspect ratio ('16:9' or '9:16')
 * @returns Video URL once generation is complete
 */
export async function generateVideoFromImage(
  prompt: string,
  imageUrl: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> {
  try {
    // Create video generation task with Veo3
    const generateResponse = await fetch(`${KIE_AI_BASE_URL}/api/v1/veo/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'veo3',
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

      console.log(`Video task status response:`, JSON.stringify(statusData, null, 2))

      if (statusData.code !== 200) {
        throw new Error(`Failed to check video task status: ${statusData.msg}`)
      }

      if ((statusData.data.status === 'completed' || statusData.data.status === 'success') && statusData.data.videoUrl) {
        console.log(`Video generation complete: ${statusData.data.videoUrl}`)
        return statusData.data.videoUrl
      }

      if (statusData.data.status === 'failed') {
        throw new Error(`Video generation failed: ${statusData.data.error || 'Unknown error'}`)
      }
    }

    throw new Error('Video generation timed out after 5 minutes')
  } catch (error) {
    console.error('Kie.ai video generation error:', error)
    throw error
  }
}
