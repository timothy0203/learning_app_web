'use client'

import { useState, useEffect } from 'react'
import { getPublicMemories, getUserMemories, deleteMemory, type MemoryAid } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import MemoryCard from '@/components/MemoryCard'
import type { User } from '@supabase/supabase-js'

export default function SavedPage() {
  const [user, setUser] = useState<User | null>(null)
  const [memories, setMemories] = useState<MemoryAid[]>([])
  const [publicMemories, setPublicMemories] = useState<MemoryAid[]>([])
  const [tab, setTab] = useState<'public' | 'personal'>('public')
  const [filter, setFilter] = useState<'all' | 'bible' | 'japanese'>('all')

  useEffect(() => {
    getPublicMemories().then(setPublicMemories)
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) getUserMemories(u).then(setMemories)
    })
  }, [])

  const handleDelete = async (id: string) => {
    await deleteMemory(id, user)
    if (user) {
      setMemories(await getUserMemories(user))
    }
  }

  const items = tab === 'public' ? publicMemories : memories
  const filtered = filter === 'all'
    ? items
    : items.filter((m) => m.mode === filter)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold gradient-text mb-2">📚 記憶庫</h1>
        <p className="text-slate-400 text-sm">
          公開區：{publicMemories.length} 個記憶
          {user && ` ｜ 個人：${memories.length} 個記憶`}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('public')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'public'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
              : 'text-slate-400 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          公開區
        </button>
        <button
          onClick={() => {
            if (!user) {
              supabase.auth.signInWithOAuth({ provider: 'google' })
              return
            }
            setTab('personal')
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'personal'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
              : 'text-slate-400 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          個人記憶 {!user && '(登入後可用)'}
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'bible', 'japanese'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
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
            {tab === 'public'
              ? '公開區還沒有記憶，快去創造吧！'
              : '個人還沒有儲存任何記憶'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onDelete={tab === 'personal' ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
