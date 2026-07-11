'use client'

import type { MemoryAid } from '@/lib/storage'

interface BibleOutput {
  segments: Array<{ original: string; pun: string; image: string }>
  story: string
}

interface JapaneseOutput {
  type: 'word' | 'text'
  segments: Array<{
    original: string
    kana?: string
    romaji?: string
    meaning?: string
    memoryAids?: Array<{ word: string; pun: string; image: string }>
  }>
}

export default function MemoryCard({
  memory,
  onDelete,
}: {
  memory: MemoryAid
  onDelete?: (id: string) => void
}) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <span className={memory.mode === 'bible' ? 'tag-bible' : 'tag-japanese'}>
          {memory.mode === 'bible' ? '聖經' : '日文'}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(memory.id)}
            className="text-slate-500 hover:text-red-400 text-sm transition-colors"
          >
            刪除
          </button>
        )}
      </div>

      <div>
        <div className="text-xs text-slate-500 mb-1">輸入</div>
        <p className="text-slate-300 text-sm leading-relaxed">{memory.input}</p>
      </div>

      {memory.mode === 'bible' && renderBibleOutput(memory.output as BibleOutput)}
      {memory.mode === 'japanese' && renderJapaneseOutput(memory.output as JapaneseOutput)}
    </div>
  )
}

function renderBibleOutput(output: BibleOutput) {
  if (!output || !output.segments) return null
  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-500">諧音記憶</div>
      {output.segments.map((seg, i) => (
        <div key={i} className="segment-card">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-indigo-300 font-bold text-lg">{seg.original}</span>
            <span className="text-slate-500">→</span>
            <span className="text-amber-300 font-semibold">{seg.pun}</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{seg.image}</p>
        </div>
      ))}
      {output.story && (
        <div className="mt-3 p-3 bg-indigo-950/40 rounded-lg border border-indigo-900/50">
          <div className="text-xs text-indigo-400 mb-1">完整畫面故事</div>
          <p className="text-slate-300 text-sm leading-relaxed">{output.story}</p>
        </div>
      )}
    </div>
  )
}

function renderJapaneseOutput(output: JapaneseOutput) {
  if (!output || !output.segments) return null
  return (
    <div className="space-y-3">
      {output.segments.map((seg, i) => (
        <div key={i} className="segment-card">
          <div className="text-sky-300 font-bold text-lg mb-1">{seg.original}</div>
          {seg.kana && (
            <div className="text-slate-400 text-sm mb-1">{seg.kana}</div>
          )}
          {seg.romaji && (
            <div className="text-slate-500 text-xs mb-2">{seg.romaji}</div>
          )}
          {seg.meaning && (
            <div className="text-emerald-300 text-sm mb-2">意思：{seg.meaning}</div>
          )}
          {seg.memoryAids && seg.memoryAids.length > 0 && (
            <div className="mt-2 space-y-2">
              <div className="text-xs text-slate-500">諧音記憶</div>
              {seg.memoryAids.map((aid, j) => (
                <div key={j} className="flex items-baseline gap-2 text-sm">
                  <span className="text-amber-300 font-medium">{aid.word}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-amber-200">{aid.pun}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{aid.image}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
