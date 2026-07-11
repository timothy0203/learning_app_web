'use client'

import { useState } from 'react'
import { saveMemory, type MemoryAid } from '@/lib/storage'
import MemoryCard from '@/components/MemoryCard'
import { useRouter } from 'next/navigation'

export default function JapanesePage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MemoryAid | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    setResult(null)

    try {
      if (!text.trim()) {
        throw new Error('請輸入日文單字或句子')
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'japanese', text: text.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '生成失敗')
      }

      const output = await res.json()
      const memory: MemoryAid = {
        id: Date.now().toString(),
        mode: 'japanese',
        input: text.trim(),
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
        <h1 className="text-2xl font-bold gradient-text mb-2">🗾 日文記憶</h1>
        <p className="text-slate-400 text-sm">
          輸入日文單字或整段句子，AI 用中文/注音諧音幫你記憶
        </p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            日文輸入（支援單字或整段句子）
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`例如單字：shiro / 白 / しろ\n\n或整段句子：\n日本の皆様、\n私たちは、お正月の1月1日に大きな地震が能登半島で起きたというニュースを受け取りました。`}
            rows={6}
            className="input-field resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="btn-primary w-full"
        >
          {loading ? 'AI 分析中...' : '🎯 生成記憶輔助'}
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
              className="text-sm text-sky-400 hover:text-sky-300"
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
