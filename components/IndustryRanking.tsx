import { Trophy } from 'lucide-react'

interface Props {
  score: number
  industry: string
}

function cleanLabel(industry: string): string {
  const first = industry.split('/')[0].trim()
  return first.length > 25 ? first.slice(0, 23) + '...' : first
}

function getDrittel(score: number) {
  if (score >= 51) return {
    label: 'Gutes Mittelfeld',
    color: '#f97316',
    barWidth: 55,
    text: 'Gute Präsenz. Wenige Maßnahmen bringen dich in die Top-Empfehlungen bei ChatGPT & Co.',
  }
  return {
    label: 'Unteres Drittel',
    color: '#ef4444',
    barWidth: 25,
    text: 'Über 70% deiner Branche sind bei ChatGPT & Co. bekannter. Gezielte Maßnahmen helfen schnell.',
  }
}

export default function IndustryRanking({ score, industry }: Props) {
  const drittel = getDrittel(score)
  const branche = cleanLabel(industry)

  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={18} style={{ color: '#A8E6A3' }} />
        <h2 className="font-semibold text-white text-sm">Dein Branchen-Ranking</h2>
      </div>
      <p className="text-gray-200 text-sm mb-3 flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: drittel.color }} />
        <span><span className="font-semibold text-white">{drittel.label}</span> · {branche}</span>
      </p>
      <div className="w-full bg-white/10 rounded-full h-3 mb-3">
        <div
          className="h-3 rounded-full transition-all"
          style={{ width: `${drittel.barWidth}%`, backgroundColor: '#A8E6A3' }}
        />
      </div>
      <p className="text-gray-400 text-xs font-light mb-2">{drittel.text}</p>
      <p className="text-gray-600 text-[10px]">Richtwert basierend auf Branchendurchschnitt</p>
    </div>
  )
}
