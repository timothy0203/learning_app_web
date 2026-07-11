import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface MemoryAid {
  id: string
  user_id?: string | null
  mode: 'bible' | 'japanese'
  input: string
  output: unknown
  is_public: boolean
  created_at: string
}

function localGet(): MemoryAid[] {
  const raw = localStorage.getItem('memories')
  return raw ? JSON.parse(raw) : []
}

function localSet(items: MemoryAid[]) {
  localStorage.setItem('memories', JSON.stringify(items))
}

export async function getPublicMemories(): Promise<MemoryAid[]> {
  try {
    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) return data as MemoryAid[]
  } catch { /* table not ready yet */ }

  return []
}

export async function getUserMemories(user: User | null): Promise<MemoryAid[]> {
  if (!user) return localGet()

  try {
    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (data) return data as MemoryAid[]
  } catch { /* table not ready yet */ }

  return localGet()
}

export async function saveMemory(
  input: Omit<MemoryAid, 'id' | 'created_at' | 'user_id'>,
  user: User | null
): Promise<void> {
  if (!user) {
    const item: MemoryAid = {
      ...input,
      id: crypto.randomUUID(),
      user_id: null,
      created_at: new Date().toISOString(),
    }
    const all = localGet()
    all.unshift(item)
    localSet(all)
    return
  }

  try {
    await supabase.from('memories').insert({
      user_id: user.id,
      mode: input.mode,
      input: input.input,
      output: input.output,
      is_public: input.is_public,
    })
  } catch { /* table not ready yet, fallback to local */ }
}

export async function deleteMemory(id: string, user: User | null): Promise<void> {
  if (!user) {
    localSet(localGet().filter((m) => m.id !== id))
    return
  }

  try {
    await supabase.from('memories').delete().eq('id', id).eq('user_id', user.id)
  } catch { /* table not ready yet */ }
}
