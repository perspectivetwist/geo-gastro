'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { GeoAnalysis } from '@/types/geo'
import ScoreDisplay from '@/components/ScoreDisplay'
import ScoreDimensions from '@/components/ScoreDimensions'
import IndustryRanking from '@/components/IndustryRanking'
import EmailGate from '@/components/EmailGate'
import ActionPlan from '@/components/ActionPlan'
import CrossSell from '@/components/CrossSell'
import { trackScanComplete, trackEmailGate } from '@/lib/gtag'

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlParam = searchParams.get('url') || ''

  const [result, setResult] = useState<GeoAnalysis | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const unlocked = localStorage.getItem('geo_unlocked') === 'true'
    setIsUnlocked(unlocked)

    const cached = sessionStorage.getItem('geo_scan_result')
    if (!cached) {
      router.push('/')
      return
    }

    try {
      const data: GeoAnalysis = JSON.parse(cached)
      setResult(data)
      trackScanComplete(data.url, data.score.total)
    } catch {
      router.push('/')
    }

    if (!unlocked) trackEmailGate('shown')
  }, [router])

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </main>
    )
  }

  function handleUnlock() {
    localStorage.setItem('geo_unlocked', 'true')
    setIsUnlocked(true)
  }

  // Use URL from searchParams if available, otherwise fall back to result.url
  const displayUrl = urlParam ? decodeURIComponent(urlParam) : result.url

  return (
    <main className={`min-h-screen ${!isUnlocked ? 'pb-32' : ''}`}>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <ScoreDisplay score={result.score} url={result.url} />

        <IndustryRanking
          score={result.score.total}
          industry={result.industry || 'Websites allgemein'}
        />

        <ScoreDimensions score={result.score} />

        {result.actionPlan && (
          <ActionPlan actionPlan={result.actionPlan} isUnlocked={isUnlocked} />
        )}

        <CrossSell />

        <div className="text-center pt-4">
          <a href="/" className="text-primary hover:text-primary-dim font-light text-sm">
            &larr; Weitere Website analysieren
          </a>
        </div>

        {/* ASD Hotmail Footer */}
        <div className="text-center pt-8 pb-4 border-t border-white/10 mt-8">
          <a
            href="https://ai-gastro-hub.vercel.app?utm_source=geo&utm_medium=report&utm_campaign=hotmail"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Erstellt mit AI Shift Drift | Kostenloser KI-Scan f&uuml;r Restaurants
          </a>
        </div>
      </div>

      {!isUnlocked && (
        <EmailGate
          primaryColor="#A8E6A3"
          scannerSource="GEO"
          url={displayUrl}
          onUnlock={handleUnlock}
        />
      )}
    </main>
  )
}

export default function ResultsClient() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </main>
    }>
      <ResultsContent />
    </Suspense>
  )
}
