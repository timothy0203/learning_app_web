-- 開啟 Supabase SQL Editor，貼上執行這段 SQL

CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('bible', 'japanese')),
  input TEXT NOT NULL,
  output JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- 任何人都能看公開的記憶
CREATE POLICY "Public memories are viewable by everyone"
  ON memories FOR SELECT
  USING (is_public = true);

-- 使用者只能看自己的記憶
CREATE POLICY "Users can view their own memories"
  ON memories FOR SELECT
  USING (auth.uid() = user_id);

-- 使用者只能建立自己的記憶
CREATE POLICY "Users can create their own memories"
  ON memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 使用者只能更新自己的記憶
CREATE POLICY "Users can update their own memories"
  ON memories FOR UPDATE
  USING (auth.uid() = user_id);

-- 使用者只能刪除自己的記憶
CREATE POLICY "Users can delete their own memories"
  ON memories FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_memories_user_id ON memories(user_id);
CREATE INDEX idx_memories_is_public ON memories(is_public);
CREATE INDEX idx_memories_created_at ON memories(created_at DESC);
