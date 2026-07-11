'use client'

import { useState } from 'react'
import { BIBLE_BOOKS, fetchBibleVerse } from '@/lib/bible'
import { saveMemory, type MemoryAid } from '@/lib/storage'
import MemoryCard from '@/components/MemoryCard'
import { useRouter } from 'next/navigation'

export default function BiblePage() {
  const router = useRouter()
  const [mode, setMode] = useState<'paste' | 'select'>('paste')
  const [text, setText] = useState('')
  const [book, setBook] = useState('GEN')
  const [chapter, setChapter] = useState('1')
  const [verse, setVerse] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MemoryAid | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const inputText = mode === 'select'
        ? await fetchBibleVerse(book, parseInt(chapter), verse || undefined)
        : text

      if (!inputText.trim()) {
        throw new Error('請輸入經文或選擇書卷章節')
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'bible', text: inputText }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '生成失敗')
      }

      const output = await res.json()
      const memory: MemoryAid = {
        id: Date.now().toString(),
        mode: 'bible',
        input: inputText,
        output,
        createdAt: Date.now(),
      }

      setResult(memory)
      saveMemory(memory)
    } catch (e) {
      setError(e instanceof Error ? e.message : '發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold gradient-text mb-2">📖 聖經記憶</h1>
        <p className="text-slate-400 text-sm">
          輸入經文或選擇書卷，AI 會幫你創造諧音視覺記憶
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode('paste')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
              : 'text-slate-400 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          貼上經文
        </button>
        <button
          onClick={() => setMode('select')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'select'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
              : 'text-slate-400 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          選擇書卷章節
        </button>
      </div>

      <div className="card space-y-4">
        {mode === 'paste' ? (
          <div>
            <label className="block text-sm text-slate-400 mb-2">貼上經文內容</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例如：在萬古之先所應許的永生"
              rows={4}
              className="input-field resize-none"
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">書卷</label>
              <select
                value={book}
                onChange={(e) => setBook(e.target.value)}
                className="select-field"
              >
                {BIBLE_BOOKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">章</label>
              <input
                type="number"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                min={1}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                節（選填，留空則讀取全章）
              </label>
              <input
                type="text"
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                placeholder="例如 1-3 或 5"
                className="input-field"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || (mode === 'paste' && !text.trim())}
          className="btn-primary w-full"
        >
          {loading ? 'AI 生成中...' : '🎯 生成記憶輔助'}
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">記憶結果</h2>
            <button
              onClick={() => router.push('/saved')}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              已儲存，查看記憶庫 →
            </button>
          </div>
          <MemoryCard memory={result} />
        </div>
      )}
    </div>
  )
}
