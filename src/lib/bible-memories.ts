import { supabase } from './supabase'

export interface BibleMemory {
  id: string
  book: string
  chapter: number
  version: number
  full_text: string
  segments: unknown
  story: string
  created_at: string
}

export async function getBibleMemories(
  book: string,
  chapter: number
): Promise<BibleMemory[]> {
  const { data } = await supabase
    .from('bible_memories')
    .select('*')
    .eq('book', book)
    .eq('chapter', chapter)
    .order('version', { ascending: true })

  return (data as BibleMemory[]) || []
}

export async function saveBibleMemory(
  book: string,
  chapter: number,
  version: number,
  fullText: string,
  segments: unknown,
  story: string
): Promise<void> {
  await supabase.from('bible_memories').upsert(
    {
      book,
      chapter,
      version,
      full_text: fullText,
      segments,
      story,
    },
    { onConflict: 'book,chapter,version' }
  )
}

export async function getNextVersion(book: string, chapter: number): Promise<number> {
  const { data } = await supabase
    .from('bible_memories')
    .select('version')
    .eq('book', book)
    .eq('chapter', chapter)
    .order('version', { ascending: false })
    .limit(1)

  if (data && data.length > 0) {
    return (data[0] as { version: number }).version + 1
  }
  return 1
}
