export interface MemoryAid {
  id: string
  mode: 'bible' | 'japanese'
  input: string
  output: unknown
  createdAt: number
}

export function getSavedMemories(): MemoryAid[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('memories')
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveMemory(memory: MemoryAid): void {
  if (typeof window === 'undefined') return
  const memories = getSavedMemories()
  memories.unshift(memory)
  localStorage.setItem('memories', JSON.stringify(memories))
}

export function deleteMemory(id: string): void {
  if (typeof window === 'undefined') return
  const memories = getSavedMemories().filter((m) => m.id !== id)
  localStorage.setItem('memories', JSON.stringify(memories))
}
