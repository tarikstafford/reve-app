-- Add media_status column to dreams and manifestations tables
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS media_status TEXT DEFAULT 'pending'
  CHECK (media_status IN ('pending', 'processing', 'completed', 'failed'));

ALTER TABLE manifestations ADD COLUMN IF NOT EXISTS media_status TEXT DEFAULT 'pending'
  CHECK (media_status IN ('pending', 'processing', 'completed', 'failed'));

-- Create media generation queue table
CREATE TABLE IF NOT EXISTS media_generation_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('dream', 'manifestation', 'ideal_self')),
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  image_prompt TEXT,
  video_prompt TEXT,
  image_url TEXT,
  video_url TEXT,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_queue_status ON media_generation_queue(status);
CREATE INDEX IF NOT EXISTS idx_media_queue_entity ON media_generation_queue(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_queue_user_id ON media_generation_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_media_queue_created_at ON media_generation_queue(created_at);

-- RLS policies for media_generation_queue
ALTER TABLE media_generation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own media generation tasks"
  ON media_generation_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all media generation tasks"
  ON media_generation_queue FOR ALL
  USING (true);
