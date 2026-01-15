-- Create table for user diagrams
CREATE TABLE user_diagrams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source_code TEXT NOT NULL,
  diagram_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE user_diagrams ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access their own diagrams
CREATE POLICY "Users can view their own diagrams" ON user_diagrams
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own diagrams" ON user_diagrams
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own diagrams" ON user_diagrams
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own diagrams" ON user_diagrams
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create index for better performance
CREATE INDEX idx_user_diagrams_user_id ON user_diagrams(user_id);
CREATE INDEX idx_user_diagrams_created_at ON user_diagrams(created_at DESC);