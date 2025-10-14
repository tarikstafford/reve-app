/**
 * Supabase Storage Upload Helpers
 * Downloads media from external URLs and uploads to Supabase Storage
 */

import { createServiceClient } from '@/lib/supabase/server'

const STORAGE_BUCKET = 'media'

/**
 * Download file from URL and upload to Supabase Storage
 * @param sourceUrl - External URL to download from
 * @param destinationPath - Path in Supabase Storage (e.g., 'dreams/image-123.png')
 * @returns Public URL of uploaded file
 */
export async function downloadAndUploadToStorage(
  sourceUrl: string,
  destinationPath: string
): Promise<string> {
  try {
    // Download file from source URL
    const response = await fetch(sourceUrl)

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`)
    }

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage using service role (bypasses RLS)
    const supabase = createServiceClient()

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(destinationPath, buffer, {
        contentType: blob.type,
        upsert: true
      })

    if (error) {
      throw new Error(`Failed to upload to Supabase Storage: ${error.message}`)
    }

    // Get URL (works for both public and private buckets)
    // For public buckets: returns permanent public URL
    // For private buckets: will need to create signed URLs on access
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(destinationPath)

    return publicUrl
  } catch (error) {
    console.error('Error in downloadAndUploadToStorage:', error)
    throw error
  }
}

/**
 * Generate storage path for dream images
 */
export function getDreamImagePath(userId: string, dreamId: string): string {
  return `dreams/${userId}/${dreamId}/image.png`
}

/**
 * Generate storage path for dream videos
 */
export function getDreamVideoPath(userId: string, dreamId: string): string {
  return `dreams/${userId}/${dreamId}/video.mp4`
}

/**
 * Generate storage path for manifestation images
 */
export function getManifestationImagePath(userId: string, manifestationId: string): string {
  return `manifestations/${userId}/${manifestationId}/image.png`
}

/**
 * Generate storage path for manifestation videos
 */
export function getManifestationVideoPath(userId: string, manifestationId: string): string {
  return `manifestations/${userId}/${manifestationId}/video.mp4`
}

/**
 * Generate storage path for ideal self images
 */
export function getIdealSelfImagePath(userId: string): string {
  return `profiles/${userId}/ideal-self.png`
}
