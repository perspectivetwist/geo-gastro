'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

const COLOR = '#A8E6A3'

const loadingSteps = [
  'Analysiere Schema Markup…',
  'Prüfe Zitierbarkeit…',
  'Analysiere Authority-Signale…',
  'Prüfe Content-Struktur…',
  'Berechne GEO-Score…',
]

function LoadingState({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <video
        src="/loading-anim.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-64 h-64 object-cover pointer-events-none"
        style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 70%)', maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 70%)' }}
        ref={(el) => { if (el) el.playbackRate = 0.7 }}
      />

      <div className="flex flex-col items-center gap-3">
        <span className="text-sm font-medium" style={{ color: COLOR }}>
          {loadingSteps[step]}
        </span>
        <div className="flex gap-1.5">
          {loadingSteps.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: i <= step ? COLOR : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ScanningContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url') || ''

  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState('')

  // Cycle through loading steps
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1
        return prev
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Run scan
  useEffect(() => {
    if (!url) {
      setError('Keine URL angegeben')
      return
    }

    async function runScan() {
      try {
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: decodeURIComponent(url) }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Analyse fehlgeschlagen')
          return
        }

        // Store result and redirect
        sessionStorage.setItem('geo_scan_result', JSON.stringify(data))
        router.push('/results?url=' + encodeURIComponent(url))
      } catch {
        setError('Verbindung fehlgeschlagen. Bitte versuche es erneut.')
      }
    }

    runScan()
  }, [url, router])

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-xl font-bold text-white mb-2">Analyse fehlgeschlagen</h1>
          <p className="text-gray-400 font-light mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            {url && (
              <button
                onClick={() => { setError(''); window.location.reload() }}
                className="inline-block px-6 h-11 leading-[2.75rem] bg-primary text-black rounded-xl font-semibold text-sm hover:bg-primary-dim transition-colors"
              >
                Erneut versuchen
              </button>
            )}
            <a
              href="/"
              className="inline-block px-6 h-11 leading-[2.75rem] bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              Zurück zur Startseite
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <LoadingState step={loadingStep} />
      </div>
    </main>
  )
}

export default function ScanningPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-sm font-medium" style={{ color: COLOR }}>Wird geladen…</div>
      </main>
    }>
      <ScanningContent />
    </Suspense>
  )
}
