'use client'

import { CheckCircle, AlertCircle } from 'lucide-react'

interface RecommendationsProps {
  recommendations: string[]
  found: string[]
  missing: string[]
}

export default function Recommendations({ recommendations, found, missing }: RecommendationsProps) {
  return (
    <div className="space-y-6">
      {/* Was gut läuft */}
      {found.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Das machst du richtig</h2>
          <ul className="space-y-2">
            {found.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Was fehlt */}
      {missing.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Das fehlt noch</h2>
          <ul className="space-y-2">
            {missing.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Handlungsempfehlungen */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl bg-accent/50 border border-primary/20 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Deine Handlungsempfehlungen</h2>
          <ol className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
