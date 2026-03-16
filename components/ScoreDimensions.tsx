'use client'

import { GeoScore } from '@/types/geo'
import { dimensionLabels } from '@/lib/score-labels'

interface ScoreDimensionsProps {
  score: GeoScore
}

function getBarColor(score: number, maxScore: number): string {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct <= 30) return '#ef4444'
  if (pct <= 60) return '#f97316'
  if (pct <= 85) return '#eab308'
  return '#22c55e'
}

function getScoreBadge(value: number): { text: string; color: string } | null {
  if (value === 0) return { text: 'Kritisch', color: '#ef4444' }
  if (value <= 30) return { text: 'Schwach', color: '#f97316' }
  return null
}

export default function ScoreDimensions({ score }: ScoreDimensionsProps) {
  const dims = Object.entries(score.dimensions) as [string, number][]

  // Worst-first: sort ascending by score
  const sorted = [...dims].sort((a, b) => a[1] - b[1])

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">5 Bereiche im Detail</h2>
      <div className="space-y-4">
        {sorted.map(([key, value], i) => {
          const info = dimensionLabels[key]
          if (!info) return null
          const pct = (value / info.maxScore) * 100
          const badge = getScoreBadge(value)
          const isWorst = i === 0

          return (
            <div key={key}>
              {isWorst && (
                <p className="text-xs font-semibold mb-1" style={{ color: '#A8E6A3' }}>
                  Dein gr&ouml;&szlig;tes Risiko
                </p>
              )}
              <div className="flex justify-between items-baseline mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{info.label}</span>
                  {badge && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: badge.color + '20', color: badge.color }}
                    >
                      {badge.text}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">{value}/{info.maxScore}</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">{info.description}</div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: getBarColor(value, info.maxScore),
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
