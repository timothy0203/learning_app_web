import { NextResponse } from 'next/server'
import { generateBibleMemory, generateJapaneseMemory } from '@/lib/gemini'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const { mode, text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    const trimmed = text.slice(0, 500)

    if (mode === 'bible') {
      const result = await generateBibleMemory(trimmed)
      return NextResponse.json(result)
    }

    if (mode === 'japanese') {
      const result = await generateJapaneseMemory(trimmed)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (error) {
    console.error('Generate error:', error)
    const message = error instanceof Error ? error.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
