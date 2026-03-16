'use client'

import { GeoActionPlan, DimensionAction } from '@/types/geo'
import BlurWrapper from './BlurWrapper'

interface Props {
  actionPlan: GeoActionPlan
  isUnlocked?: boolean
}

function getBadge(scoreStr: string): { label: string; color: string } {
  const match = scoreStr.match(/(\d+)\/(\d+)/)
  if (!match) return { label: 'WICHTIG', color: '#f97316' }
  const pct = (parseInt(match[1]) / parseInt(match[2])) * 100
  if (pct <= 30) return { label: 'KRITISCH', color: '#ef4444' }
  if (pct <= 60) return { label: 'WICHTIG', color: '#f97316' }
  return { label: 'EMPFOHLEN', color: '#eab308' }
}

function ActionCard({ item }: { item: DimensionAction }) {
  const badge = getBadge(item.score)
  return (
    <div className="rounded-xl p-4 bg-white/[0.03] border border-white/10">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border"
            style={{ color: badge.color, backgroundColor: badge.color + '15', borderColor: badge.color + '40' }}
          >
            {badge.label}
          </span>
          <span className="text-xs text-gray-500">{item.title}</span>
        </div>
        {item.effort && (
          <span className="text-xs text-gray-400 whitespace-nowrap">{item.effort}</span>
        )}
      </div>
      <p className="text-sm text-white font-medium mb-2">{item.topFix}</p>
      {item.steps.length > 0 && (
        <ol className="space-y-1 mb-2">
          {item.steps.map((step, j) => (
            <li key={j} className="flex items-start gap-2 text-xs text-gray-300 font-light">
              <span className="text-primary font-semibold shrink-0">{j + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs font-light text-gray-400">{item.businessImpact}</p>
    </div>
  )
}

export default function ActionPlan({ actionPlan, isUnlocked = true }: Props) {
  const visibleActions = actionPlan.actions.slice(0, 2)
  const gatedActions = actionPlan.actions.slice(2)

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
      <h2 className="font-semibold text-white mb-2">Dein Aktionsplan</h2>
      <p className="text-sm font-light text-gray-400 mb-5">{actionPlan.summary}</p>

      <div className="space-y-3">
        {visibleActions.map((item, i) => (
          <ActionCard key={i} item={item} />
        ))}

        {gatedActions.length > 0 && !isUnlocked && (
          <BlurWrapper bgColor="#0A0A0A">
            <div className="space-y-3">
              {gatedActions.map((item, i) => (
                <ActionCard key={i + 2} item={item} />
              ))}
            </div>
          </BlurWrapper>
        )}

        {gatedActions.length > 0 && isUnlocked &&
          gatedActions.map((item, i) => (
            <ActionCard key={i + 2} item={item} />
          ))
        }
      </div>
    </div>
  )
}
