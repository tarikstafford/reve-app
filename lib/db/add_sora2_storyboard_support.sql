-- Add support for Sora 2 Pro Storyboard with 3-part video prompts
-- This migration updates the media_generation_queue table to store 3 prompts
-- for creating a 15-second video (3 chunks of 5 seconds each)

-- Add new columns for 3-part video prompts
ALTER TABLE media_generation_queue
ADD COLUMN IF NOT EXISTS video_prompt_part1 TEXT,
ADD COLUMN IF NOT EXISTS video_prompt_part2 TEXT,
ADD COLUMN IF NOT EXISTS video_prompt_part3 TEXT;

-- Migrate existing video_prompt data to video_prompt_part1
-- This ensures backward compatibility
UPDATE media_generation_queue
SET video_prompt_part1 = video_prompt
WHERE video_prompt IS NOT NULL AND video_prompt_part1 IS NULL;

-- Note: We keep the original video_prompt column for backward compatibility
-- and for entities that don't use the 3-part storyboard approach
