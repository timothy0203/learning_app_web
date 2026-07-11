import { NextResponse } from 'next/server'
import { fetchBibleVerse } from '@/lib/bible'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get('book')
  const chapter = searchParams.get('chapter')
  const verse = searchParams.get('verse')

  if (!bookId || !chapter) {
    return NextResponse.json(
      { error: 'Missing book or chapter' },
      { status: 400 }
    )
  }

  try {
    const text = await fetchBibleVerse(bookId, parseInt(chapter), verse || undefined)
    return NextResponse.json({ text })
  } catch (error) {
    console.error('Bible API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Bible verse' },
      { status: 500 }
    )
  }
}
