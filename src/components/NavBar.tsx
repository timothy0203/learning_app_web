'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthBar from './AuthBar'

const links = [
  { href: '/', label: '首頁' },
  { href: '/bible', label: '聖經記憶' },
  { href: '/japanese', label: '日文記憶' },
  { href: '/saved', label: '記憶庫' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold gradient-text">
          記憶大師
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
          <AuthBar />
        </div>
      </div>
    </nav>
  )
}
