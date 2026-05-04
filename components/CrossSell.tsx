import { Eye, Bot, ShieldCheck } from 'lucide-react'

export default function CrossSell() {
  return (
    <div className="mt-8 p-4 border border-white/10 rounded-lg bg-white/5">
      <p className="text-sm text-gray-400 mb-3">Auch interessant für dein Restaurant:</p>
      <div className="flex flex-wrap gap-2">
        <a href="https://www.ki-gastronomie.com/aeo-scanner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors">
          <Eye size={14} style={{ color: '#6366f1' }} /> AEO-Scanner
        </a>
        <a href="https://www.ki-gastronomie.com/agent-scanner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors">
          <Bot size={14} style={{ color: '#FFE600' }} /> Agent-Readiness
        </a>
        <a href="https://www.ki-gastronomie.com/security-scanner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors">
          <ShieldCheck size={14} style={{ color: '#FF2D55' }} /> Sicherheits-Scan
        </a>
      </div>
    </div>
  )
}
