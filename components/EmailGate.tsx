'use client'

import { useState } from 'react'

interface Props {
  primaryColor: string
  scannerSource: string
  url: string
  onUnlock: () => void
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

export default function EmailGate({ primaryColor, scannerSource, url, onUnlock }: Props) {
  const [showInput, setShowInput] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const textColor = isLightColor(primaryColor) ? '#000000' : '#ffffff'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Bitte gültige Email eingeben')
      return
    }

    setLoading(true)
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, url, source: scannerSource }),
      })
    } catch {
      // Silent fail
    }
    onUnlock()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-2xl">
          {!showInput ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-white font-medium">
                Dein vollständiger Aktionsplan — kostenlos, keine Kreditkarte
              </p>
              <button
                onClick={() => setShowInput(true)}
                className="h-10 px-5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all shrink-0"
                style={{ backgroundColor: primaryColor, color: textColor }}
              >
                Aktionsplan freischalten &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <p className="text-sm text-white font-medium shrink-0 hidden sm:block">
                Dein Aktionsplan
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="flex-1 h-10 px-3 bg-white/10 border border-white/20 text-white text-sm rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 min-w-0"
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="h-10 px-5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all disabled:opacity-50 shrink-0"
                style={{ backgroundColor: primaryColor, color: textColor }}
              >
                {loading ? '...' : 'Freischalten \u2192'}
              </button>
            </form>
          )}
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      </div>
    </div>
  )
}
