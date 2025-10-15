-- Create dream_analyses table for multiple analyst perspectives
CREATE TABLE IF NOT EXISTS dream_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dream_id UUID NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  analyst_id TEXT NOT NULL, -- 'jung', 'freud', etc.
  analysis TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dream_id, analyst_id)
);

-- Enable RLS
ALTER TABLE dream_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see analyses for their own dreams
CREATE POLICY "Users can view their own dream analyses"
  ON dream_analyses
  FOR SELECT
  USING (
    dream_id IN (
      SELECT id FROM dreams WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Service role can insert analyses
CREATE POLICY "Service role can insert dream analyses"
  ON dream_analyses
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS dream_analyses_dream_id_idx ON dream_analyses(dream_id);
CREATE INDEX IF NOT EXISTS dream_analyses_analyst_id_idx ON dream_analyses(analyst_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_dream_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dream_analyses_updated_at
  BEFORE UPDATE ON dream_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_dream_analyses_updated_at();
