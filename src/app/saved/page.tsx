'use client'

import { useState, useEffect } from 'react'
import { getSavedMemories, deleteMemory, type MemoryAid } from '@/lib/storage'
import MemoryCard from '@/components/MemoryCard'

export default function SavedPage() {
  const [memories, setMemories] = useState<MemoryAid[]>([])
  const [filter, setFilter] = useState<'all' | 'bible' | 'japanese'>('all')

  useEffect(() => {
    setMemories(getSavedMemories())
  }, [])

  const handleDelete = (id: string) => {
    deleteMemory(id)
    setMemories(getSavedMemories())
  }

  const handleClearAll = () => {
    if (window.confirm('確定要刪除所有記憶嗎？')) {
      localStorage.removeItem('memories')
      setMemories([])
    }
  }

  const filtered = filter === 'all'
    ? memories
    : memories.filter((m) => m.mode === filter)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-2">📚 我的記憶庫</h1>
          <p className="text-slate-400 text-sm">
            共 {memories.length} 個記憶輔助
          </p>
        </div>
        {memories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            清除全部
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {(['all', 'bible', 'japanese'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 border border-slate-700 hover:bg-slate-800'
            }`}
          >
            {f === 'all' ? '全部' : f === 'bible' ? '聖經' : '日文'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-slate-500">
            {memories.length === 0
              ? '還沒有任何記憶輔助，去首頁開始學習吧！'
              : '沒有符合篩選條件的記憶'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
