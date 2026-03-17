'use client'

import { useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { trackScanStart } from '@/lib/gtag'

// Shared active scans state — all UrlInputForm instances show the same number
let sharedScans = Math.floor(Math.random() * 10) + 3
const listeners = new Set<() => void>()
let intervalId: ReturnType<typeof setInterval> | null = null

function startSharedInterval() {
  if (intervalId) return
  intervalId = setInterval(() => {
    const change = Math.random() > 0.5 ? 1 : -1
    sharedScans = Math.max(2, Math.min(15, sharedScans + change))
    listeners.forEach(l => l())
  }, Math.random() * 7000 + 8000)
}

function subscribeScans(cb: () => void) {
  listeners.add(cb)
  startSharedInterval()
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}

function getScansSnapshot() {
  return sharedScans
}

function NetworkIcon() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      <svg width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
        {/* Connection lines */}
        <line x1="12" y1="4" x2="20" y2="12" stroke="#A8E6A3" strokeWidth="1" style={{ animation: 'line-flicker 1.5s ease-in-out infinite' }} />
        <line x1="20" y1="12" x2="12" y2="20" stroke="#A8E6A3" strokeWidth="1" style={{ animation: 'line-flicker 1.5s ease-in-out infinite 0.2s' }} />
        <line x1="12" y1="20" x2="4" y2="12" stroke="#A8E6A3" strokeWidth="1" style={{ animation: 'line-flicker 1.5s ease-in-out infinite 0.4s' }} />
        <line x1="4" y1="12" x2="12" y2="4" stroke="#A8E6A3" strokeWidth="1" style={{ animation: 'line-flicker 1.5s ease-in-out infinite 0.6s' }} />
        {/* Diagonal lines */}
        <line x1="12" y1="4" x2="12" y2="20" stroke="#A8E6A3" strokeWidth="0.5" opacity="0.3" />
        <line x1="4" y1="12" x2="20" y2="12" stroke="#A8E6A3" strokeWidth="0.5" opacity="0.3" />
        {/* Nodes */}
        <circle cx="12" cy="4" r="2" fill="#A8E6A3" style={{ animation: 'node-pulse 1.5s ease-in-out infinite' }} />
        <circle cx="20" cy="12" r="2" fill="#A8E6A3" style={{ animation: 'node-pulse 1.5s ease-in-out infinite 0.2s' }} />
        <circle cx="12" cy="20" r="2" fill="#A8E6A3" style={{ animation: 'node-pulse 1.5s ease-in-out infinite 0.4s' }} />
        <circle cx="4" cy="12" r="2" fill="#A8E6A3" style={{ animation: 'node-pulse 1.5s ease-in-out infinite 0.6s' }} />
      </svg>
    </div>
  )
}

export default function UrlInputForm() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const activeScans = useSyncExternalStore(subscribeScans, getScansSnapshot, getScansSnapshot)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmed = url.trim()
    if (!trimmed) {
      setError('Bitte URL eingeben')
      return
    }

    if (trimmed.length > 500) {
      setError('URL zu lang (max 500 Zeichen)')
      return
    }

    trackScanStart(trimmed)
    router.push(`/scanning?url=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-row gap-3 items-start">
        <div className="flex-1 w-full">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://deine-website.de"
              className="w-full h-11 px-4 pr-12 rounded-lg border border-white/15 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-sm"
            />
            <NetworkIcon />
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-white/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8E6A3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A8E6A3]"></span>
            </span>
            Gerade aktiv: {activeScans} Scans
          </div>
        </div>
        <button
          type="submit"
          className="relative h-11 px-4 sm:px-8 rounded-xl font-semibold text-sm transition-all overflow-hidden backdrop-blur-sm cta-glow shrink-0"
        >
          <span className="relative z-10 text-primary">
            Jetzt pr&uuml;fen
          </span>
        </button>
      </div>
    </form>
  )
}
