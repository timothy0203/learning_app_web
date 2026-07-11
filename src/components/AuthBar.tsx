'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import AuthModal from './AuthModal'

export default function AuthBar() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-xs text-slate-400 truncate max-w-[120px]">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              登出
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            登入 / 註冊
          </button>
        )}
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  )
}
