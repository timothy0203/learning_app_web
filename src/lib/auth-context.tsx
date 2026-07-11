'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import AuthModal from '@/components/AuthModal'

interface AuthCtx {
  user: User | null
  openAuth: () => void
  displayName: string
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  openAuth: () => {},
  displayName: '',
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener?.subscription.unsubscribe()
  }, [])

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''

  return (
    <AuthContext.Provider value={{ user, openAuth: () => setShowAuth(true), displayName }}>
      {children}
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
