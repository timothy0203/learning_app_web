'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

export default function AuthBar() {
  const { user, openAuth, displayName } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="text-xs text-slate-400 truncate max-w-[120px]">
            {displayName}
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
          onClick={openAuth}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          登入 / 註冊
        </button>
      )}
    </div>
  )
}
