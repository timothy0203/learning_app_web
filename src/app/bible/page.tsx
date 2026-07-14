'use client'

import { useState, useEffect, useCallback } from 'react'
import { BIBLE_BOOKS, fetchBibleVerse, getBookById } from '@/lib/bible'
import { saveMemory, type MemoryAid } from '@/lib/storage'
import { getBibleMemories, saveBibleMemory, getNextVersion, type BibleMemory } from '@/lib/bible-memories'
import { supabase } from '@/lib/supabase'
import MemoryCard from '@/components/MemoryCard'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function BiblePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [mode, setMode] = useState<'chapter' | 'paste'>('chapter')
  const [text, setText] = useState('')
  const [book, setBook] = useState('MAT')
  const [chapter, setChapter] = useState('1')
  const [verse, setVerse] = useState('')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<MemoryAid | null>(null)
  const [error, setError] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  const [chapterText, setChapterText] = useState('')
  const [existingVersions, setExistingVersions] = useState<BibleMemory[]>([])
  const [selectedVersion, setSelectedVersion] = useState(0)
  const [chapterLoading, setChapterLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
  }, [])

  useEffect(() => {
    if (mode === 'chapter') {
      loadChapter()
    }
  }, [book, chapter, mode])

  async function loadChapter() {
    const ch = parseInt(chapter)
    if (!ch || ch < 1) return

    setChapterLoading(true)
    setError('')
    setResult(null)
    setSelectedVersion(0)

    try {
      const [text, memories] = await Promise.all([
        fetchBibleVerse(book, ch),
        getBibleMemories(book, ch),
      ])
      setChapterText(text)
      setExistingVersions(memories)
    } catch (e) {
      setError(e instanceof Error ? e.message : '讀取章節失敗')
    } finally {
      setChapterLoading(false)
    }
  }

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    setResult(null)

    try {
      if (!text.trim()) {
        throw new Error('請輸入經文')
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'bible', text }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '生成失敗')
      }

      const output = await res.json()
      const memory: MemoryAid = {
        id: Date.now().toString(),
        mode: 'bible',
        input: text,
        output,
        is_public: isPublic,
        created_at: new Date().toISOString(),
      }

      setResult(memory)
      await saveMemory(memory, user)
    } catch (e) {
      setError(e instanceof Error ? e.message : '發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateChapter = async () => {
    setError('')
    setGenerating(true)

    try {
      const ch = parseInt(chapter)
      const bookInfo = getBookById(book)
      if (!bookInfo) throw new Error('未知書卷')

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'bible-chapter',
          book,
          chapter: ch,
          text: chapterText,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '生成失敗')
      }

      const output = await res.json()
      const version = await getNextVersion(book, ch)

      await saveBibleMemory(book, ch, version, chapterText, output, output.story || '')

      const memory: MemoryAid = {
        id: Date.now().toString(),
        mode: 'bible',
        input: chapterText,
        output,
        is_public: isPublic,
        created_at: new Date().toISOString(),
      }
      setResult(memory)
      await saveMemory(memory, user)

      const memories = await getBibleMemories(book, ch)
      setExistingVersions(memories)
      setSelectedVersion(memories.length - 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : '發生錯誤')
    } finally {
      setGenerating(false)
    }
  }

  const currentVersion = existingVersions[selectedVersion]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold gradient-text mb-2">📖 聖經記憶</h1>
        <p className="text-slate-400 text-sm">
          {mode === 'chapter'
            ? '選擇書卷章節，直接顯示已產生的記憶故事'
            : '輸入經文，AI 會幫你創造諧音視覺記憶'}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode('chapter')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'chapter'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
              : 'text-slate-400 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          整章模式
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
              : 'text-slate-400 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          自訂經文
        </button>
      </div>

      <div className="card space-y-4">
        {mode === 'chapter' ? (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">書卷</label>
                <select
                  value={book}
                  onChange={(e) => setBook(e.target.value)}
                  className="select-field"
                >
                  <optgroup label="新約">
                    {BIBLE_BOOKS.filter((b) => b.testament === 'nt').map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="舊約">
                    {BIBLE_BOOKS.filter((b) => b.testament === 'ot').map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">章</label>
                <input
                  type="number" value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  min={1} max={getBookById(book)?.chapters || 150}
                  className="input-field"
                />
              </div>
            </div>

            {chapterLoading ? (
              <p className="text-slate-500 text-sm">讀取章節中...</p>
            ) : chapterText ? (
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h3 className="text-sm text-slate-400 mb-2">經文內容</h3>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {chapterText}
                  </p>
                </div>

                {existingVersions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm text-slate-400">
                          版本 {selectedVersion + 1} / {existingVersions.length}
                        </h3>
                        {existingVersions.length > 1 && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => setSelectedVersion(Math.max(0, selectedVersion - 1))}
                              disabled={selectedVersion === 0}
                              className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                            >
                              ◀
                            </button>
                            <button
                              onClick={() => setSelectedVersion(Math.min(existingVersions.length - 1, selectedVersion + 1))}
                              disabled={selectedVersion === existingVersions.length - 1}
                              className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                            >
                              ▶
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleGenerateChapter}
                        disabled={generating}
                        className="text-xs px-3 py-1.5 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 disabled:opacity-50"
                      >
                        {generating ? '生成中...' : '重新產生新版本'}
                      </button>
                    </div>

                    {currentVersion && (
                      <MemoryCard
                        memory={{
                          id: currentVersion.id,
                          mode: 'bible',
                          input: currentVersion.full_text,
                          output: { segments: currentVersion.segments, story: currentVersion.story },
                          is_public: true,
                          created_at: currentVersion.created_at,
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-500 text-sm">此章節尚未產生記憶故事</p>
                    <button
                      onClick={handleGenerateChapter}
                      disabled={generating}
                      className="btn-primary w-full"
                    >
                      {generating ? 'AI 生成中（約 20-30 秒）...' : '🎯 生成記憶故事'}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <>
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
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">章</label>
                  <input
                    type="number" value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    min={1} className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">節（選填）</label>
                  <input
                    type="text" value={verse}
                    onChange={(e) => setVerse(e.target.value)}
                    placeholder="1-3" className="input-field"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800"
              />
              公開此記憶（所有人都能看見）
            </label>

            <button
              onClick={handleGenerate}
              disabled={loading || (mode === 'paste' && !text.trim())}
              className="btn-primary w-full"
            >
              {loading ? 'AI 生成中（約 20-30 秒）...' : '🎯 生成記憶輔助'}
            </button>
          </>
        )}

        {error && <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">記憶結果</h2>
            <button
              onClick={() => router.push('/saved')}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              查看記憶庫 →
            </button>
          </div>
          <MemoryCard memory={result} />
        </div>
      )}
    </div>
  )
}
