'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
    } else {
      onClose()
    }

    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="card w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-200 mb-4">
          {isSignUp ? '註冊' : '登入'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            minLength={6}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? '處理中...' : isSignUp ? '註冊' : '登入'}
          </button>
        </form>

        <div className="mt-3">
          <button onClick={handleGoogle} className="btn-primary w-full !bg-slate-700 hover:!bg-slate-600">
            Google 登入
          </button>
        </div>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-3 text-sm text-slate-400 hover:text-slate-300 w-full text-center"
        >
          {isSignUp ? '已有帳號？登入' : '沒有帳號？註冊'}
        </button>
      </div>
    </div>
  )
}
