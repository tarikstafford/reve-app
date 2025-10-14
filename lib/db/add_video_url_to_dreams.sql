-- Add video_url column to dreams table
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add video_url column to manifestations table
ALTER TABLE manifestations ADD COLUMN IF NOT EXISTS video_url TEXT;
