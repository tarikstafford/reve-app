-- Add tags array to manifestations table
ALTER TABLE manifestations
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for tag searches
CREATE INDEX IF NOT EXISTS manifestations_tags_idx ON manifestations USING GIN(tags);
