'use client'

import { KiSummary } from '@/lib/ki-summary'
import BlurWrapper from './BlurWrapper'

interface Props {
  kiSummary: KiSummary | null
  isUnlocked: boolean
}

function EyeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="#F59E0B" strokeWidth="2"/>
    </svg>
  )
}

function SummaryCard({ kiSummary }: { kiSummary: KiSummary }) {
  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-3">
        <EyeIcon />
        <h2 className="font-semibold text-white">So sieht KI dein Restaurant heute</h2>
      </div>
      <p className="text-sm font-light text-gray-300 leading-relaxed">
        {kiSummary.zusammenfassung}
      </p>
    </div>
  )
}

export default function KIZusammenfassung({ kiSummary, isUnlocked }: Props) {
  if (!kiSummary) return null

  if (!isUnlocked) {
    return (
      <BlurWrapper bgColor="#0a0a0f">
        <SummaryCard kiSummary={kiSummary} />
      </BlurWrapper>
    )
  }

  return <SummaryCard kiSummary={kiSummary} />
}
