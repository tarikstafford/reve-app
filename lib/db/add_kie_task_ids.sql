-- Add Kie.ai task IDs to media_generation_queue for recovery from polling failures
-- This allows us to check if a task succeeded even if the polling failed

-- Add columns for Kie.ai task IDs
ALTER TABLE media_generation_queue
ADD COLUMN IF NOT EXISTS kie_image_task_id TEXT,
ADD COLUMN IF NOT EXISTS kie_video_task_id TEXT;

-- Add index for faster lookups when checking old tasks
CREATE INDEX IF NOT EXISTS idx_media_queue_kie_image_task ON media_generation_queue(kie_image_task_id) WHERE kie_image_task_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_media_queue_kie_video_task ON media_generation_queue(kie_video_task_id) WHERE kie_video_task_id IS NOT NULL;
