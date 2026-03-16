'use client'

import { useEffect, useState } from 'react'
import { GeoScore } from '@/types/geo'

interface ScoreDisplayProps {
  score: GeoScore
  url: string
}

function getBand(total: number) {
  if (total <= 30) return {
    label: 'Kritisch',
    color: '#ef4444',
    text: 'ChatGPT & Co. kennen dich nicht. Wer fragt, bekommt die Konkurrenz empfohlen.',
  }
  if (total <= 60) return {
    label: 'Ausbauf\u00e4hig',
    color: '#f97316',
    text: 'Dein Ruf ist ChatGPT & Co. teilweise bekannt, aber nicht stark genug f\u00fcr eine Empfehlung.',
  }
  if (total <= 85) return {
    label: 'Gut',
    color: '#eab308',
    text: 'Solide Pr\u00e4senz. Gezielte Verbesserungen bringen dich in die Top-Empfehlungen.',
  }
  return {
    label: 'Top',
    color: '#22c55e',
    text: 'ChatGPT & Co. kennen und empfehlen dich. Halte deinen Ruf aktuell.',
  }
}

export default function ScoreDisplay({ score, url }: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const band = getBand(score.total)

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1200

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score.total))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score.total])

  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white/5 border border-white/10 backdrop-blur-sm text-center">
      <p className="text-sm font-light text-gray-500 mb-4 truncate">{url}</p>

      <div className="relative inline-flex items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 200 200" className="sm:w-[200px] sm:h-[200px]">
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="16"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke={band.color} strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white">{animatedScore}</span>
          <span className="text-xs font-light text-gray-400 mt-1">von 100</span>
        </div>
      </div>

      <div className="mt-4">
        <span className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: band.color }}>
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: band.color }} />
          {band.label}
        </span>
        <p className="text-sm font-light text-gray-400 mt-2 max-w-sm mx-auto">
          {band.text}
        </p>
      </div>
    </div>
  )
}
