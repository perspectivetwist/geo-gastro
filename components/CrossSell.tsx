import { Eye, Bot, ShieldCheck } from 'lucide-react'

export default function CrossSell() {
  return (
    <div className="mt-8 p-4 border border-white/10 rounded-lg bg-white/5">
      <p className="text-sm text-gray-400 mb-3">Auch interessant für dein Restaurant:</p>
      <div className="flex flex-wrap gap-2">
        <a href="https://aeo-gastro.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors">
          <Eye size={14} className="text-gray-400" /> AEO-Scanner
        </a>
        <a href="https://agentready-gastro.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors">
          <Bot size={14} className="text-gray-400" /> Agent-Readiness
        </a>
        <a href="https://aisecurity-gastro.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors">
          <ShieldCheck size={14} className="text-gray-400" /> Sicherheits-Scan
        </a>
      </div>
    </div>
  )
}
