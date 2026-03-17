import Link from 'next/link'

const ecosystem = [
  {
    label: "AI-Gastro-Hub",
    gradient: "linear-gradient(135deg, #FFB432 0%, #FF3CAC 50%, #FF2D78 100%)",
    dotBg: "linear-gradient(135deg, #FFB432, #FF3CAC)",
    dotShadow: "0 0 8px 2px rgba(255,60,172,0.4)",
    desc: "AI-Readiness für die Gastronomie",
    url: "https://ai-gastro-hub.vercel.app/",
  },
  {
    label: "Wake | AEO",
    color: "#6366f1",
    dotBg: "#6366f1",
    dotShadow: "0 0 8px 2px #6366f166",
    desc: "Wird dein Restaurant von ChatGPT&Co zitiert?",
    url: "https://aeo-gastro.vercel.app/",
  },
  {
    label: "Slipstream",
    color: "#FFE600",
    dotBg: "#FFE600",
    dotShadow: "0 0 8px 2px #FFE60066",
    desc: "Können Gäste via KI-Agenten bei deinem Restaurant reservieren?",
    url: "https://agentready-gastro.vercel.app/",
  },
  {
    label: "Quantum",
    color: "#FF2D55",
    dotBg: "#FF2D55",
    dotShadow: "0 0 8px 2px #FF2D5566",
    desc: "Wie angreifbar ist dein Restaurant bei KI-Attacken?",
    url: "https://aisecurity-gastro.vercel.app/",
  },
]

export default function Footer() {
  return (
    <footer className="bg-black/20 border-t border-white/10 py-8 mt-16">
      <div className="max-w-3xl mx-auto px-4">

        {/* Ecosystem Badges */}
        <div className="mb-8">
          <div className="text-xs tracking-widest uppercase mb-6" style={{ color: "#888", textShadow: "0 0 12px rgba(255,255,255,0.15)" }}>
            Teil des AI-Gastro-Hub Ökosystems
          </div>
          <div className="flex flex-col gap-4">
            {ecosystem.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-opacity duration-200 hover:opacity-80"
              >
                <div
                  className="w-[6px] h-[6px] rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: item.dotBg, boxShadow: item.dotShadow }}
                />
                <div>
                  <div
                    className="text-xs tracking-widest uppercase font-semibold"
                    style={
                      'gradient' in item
                        ? { backgroundImage: item.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                        : { color: item.color }
                    }
                  >
                    {item.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#555" }}>
                    {item.desc}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Impressum / Datenschutz / Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400 font-light">
            &copy; 2026 Ein Service von AI-SHIFT-DRIFT
          </span>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-xs text-gray-400 hover:text-white transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-xs text-gray-400 hover:text-white transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
