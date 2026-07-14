-- 開啟 Supabase SQL Editor，貼上執行這段 SQL

-- ===== memories table（使用者個人記憶） =====
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

CREATE POLICY "Public memories are viewable by everyone"
  ON memories FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own memories"
  ON memories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories"
  ON memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
  ON memories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
  ON memories FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_memories_user_id ON memories(user_id);
CREATE INDEX idx_memories_is_public ON memories(is_public);
CREATE INDEX idx_memories_created_at ON memories(created_at DESC);

-- ===== bible_memories table（整章預產生的記憶） =====
CREATE TABLE bible_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  version INTEGER DEFAULT 1,
  full_text TEXT NOT NULL,
  segments JSONB NOT NULL,
  story TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(book, chapter, version)
);

ALTER TABLE bible_memories ENABLE ROW LEVEL SECURITY;

-- 任何人都能讀（全部公開）
CREATE POLICY "Anyone can view bible memories"
  ON bible_memories FOR SELECT
  USING (true);

-- 任何人都能新增（批次腳本用 anon key 即可）
CREATE POLICY "Anyone can insert bible memories"
  ON bible_memories FOR INSERT
  WITH CHECK (true);

-- 任何人都能更新（用於重新產生新版本）
CREATE POLICY "Anyone can update bible memories"
  ON bible_memories FOR UPDATE
  USING (true);

CREATE INDEX idx_bible_memories_book_chapter ON bible_memories(book, chapter);
