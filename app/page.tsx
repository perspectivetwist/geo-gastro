import { Shield, BarChart3, Zap, Target, Brain, Search, Cpu, FileCheck, Building2, Briefcase, Users, PenTool } from 'lucide-react'
import UrlInputForm from '@/components/UrlInputForm'
import LandingFaq from '@/components/LandingFaq'

const features = [
  { icon: BarChart3, title: 'Zitierbarkeits-Score', desc: 'Wie oft würde KI dich als Quelle nennen?' },
  { icon: Brain, title: '5 KI-Signale', desc: 'Was ChatGPT, Perplexity & Co. wirklich prüfen' },
  { icon: Target, title: 'Konkrete Fixes', desc: 'Was du oder dein Entwickler diese Woche ändern kann' },
  { icon: Shield, title: 'Branchen-Vergleich', desc: 'Wie du vs. Mitbewerber in deiner Branche abschneidest' },
  { icon: Zap, title: 'In 20 Sekunden', desc: 'Sofort-Ergebnis, keine Wartezeit' },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-gradient-to-br from-primary/20 to-primary-dim/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 pt-16 sm:pt-24 pb-12 sm:pb-20 text-center">
          <p className="text-[10px] sm:text-sm font-light text-gray-300 mb-4 tracking-wide uppercase whitespace-nowrap">
            Kostenlos &middot; Kein Account n&ouml;tig &middot; Ergebnis in ~20&nbsp;Sek.
          </p>

          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-12 sm:mb-20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8E6A3]" />
            <span className="text-base font-light text-gray-300">&Uuml;ber 10.000 Restaurants auf KI-Reputation gepr&uuml;ft</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-10 sm:mb-16 leading-tight">
            Dein Restaurant-Ruf in der KI-Welt{' '}
            <span className="text-primary">
              jetzt messen
            </span>
          </h1>

          <p className="text-base sm:text-lg font-light text-gray-300 mb-10 max-w-xl mx-auto">
            Kostenloser GEO-Scan: Pr&uuml;fe wie ChatGPT, Perplexity und Google AI deinen Ruf bewerten. Bewertungen, Erw&auml;hnungen, Profil.
          </p>

          <UrlInputForm />
        </div>
      </div>

      {/* DEFINITION */}
      <section className="max-w-2xl mx-auto px-4 pt-2 pb-6 text-center">
        <p className="text-sm text-gray-400 leading-relaxed">
          Der GEO Scanner pr&uuml;ft kostenlos ob ChatGPT den Ruf deines Restaurants kennt. Bewertungen, Erw&auml;hnungen, Google-Profil. F&uuml;r lokale Gastronomiebetriebe in Deutschland.
        </p>
      </section>

      {/* STATS */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center">
          {[
            { num: '63%', label: 'aller Websites erhalten bereits AI-Traffic', source: 'Ahrefs', href: 'https://ahrefs.com/blog/ai-traffic-study/' },
            { num: '58%', label: 'der Konsumenten nutzen KI statt Google zur Produktsuche', source: 'Capgemini', href: 'https://www.capgemini.com/insights/research-library/ai-and-consumers-2025/' },
            { num: '1 von 3', label: 'Kaufentscheidungen startet heute mit einer KI-Frage', source: 'Gartner', href: 'https://www.gartner.com/en/marketing/topics/ai-in-marketing' },
          ].map(({ num, label, source, href }) => (
            <div
              key={label}
              className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {num}
              </div>
              <div className="text-xs font-light text-gray-300 mt-1">{label}</div>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 hover:text-gray-400 mt-1 inline-block">
                Quelle: <span className="underline">{source}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SO FUNKTIONIERT'S */}
      <div className="max-w-3xl mx-auto px-4 pt-16 sm:pt-24 pb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
          So funktioniert&apos;s
        </h2>
        <p className="text-base font-light text-gray-300 text-center mb-12">
          Drei Schritte zum GEO-Report f&uuml;r dein Restaurant.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Search, step: '1', title: 'URL eingeben', desc: 'Gib deine Website-URL ein. Wir scannen die Seite automatisch.' },
            { icon: Cpu, step: '2', title: 'KI analysiert', desc: 'Unsere KI pr\u00fcft 5 Dimensionen, die bestimmen ob ChatGPT dich zitiert.' },
            { icon: FileCheck, step: '3', title: 'Report erhalten', desc: 'Du bekommst deinen Score, Branchen-Vergleich und konkrete Handlungsschritte.' },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Icon size={20} className="text-primary" />
              </div>
              <div className="text-xs text-primary font-medium mb-1">Schritt {step}</div>
              <div className="font-medium text-white text-sm mb-2">{title}</div>
              <div className="text-gray-300 text-xs font-light">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="max-w-4xl mx-auto px-4 pt-16 sm:pt-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
          Was du bekommst
        </h2>
        <p className="text-base font-light text-gray-300 text-center mb-12">
          Dein GEO-Report in unter 30 Sekunden.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <Icon size={20} className="text-primary mb-3" />
              <div className="font-medium text-white text-sm">{title}</div>
              <div className="text-gray-300 text-xs font-light mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FÜR WEN */}
      <div className="max-w-4xl mx-auto px-4 pt-24 sm:pt-32">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
          F&uuml;r wen ist der GEO Scanner?
        </h2>
        <p className="text-base font-light text-gray-300 text-center mb-12">
          Jeder in der Gastronomie, der von KI-Suchmaschinen empfohlen werden will.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Building2, title: 'Restaurant-Besitzer', desc: 'Verstehe in 20 Sekunden, ob dein Restaurant von ChatGPT empfohlen wird, wenn G\u00e4ste nach einem guten Lokal fragen.' },
            { icon: Briefcase, title: 'Caf\u00e9s & Bistros', desc: 'Auch kleine Betriebe brauchen KI-Sichtbarkeit. Finde heraus, ob dein digitaler Ruf f\u00fcr KI-Empfehlungen reicht.' },
            { icon: PenTool, title: 'Gastro-Berater & Agenturen', desc: 'Zeig deinen Kunden mit einem Score, warum digitaler Ruf in der KI-Welt entscheidend ist.' },
            { icon: Users, title: 'Hotel-Restaurants & Caterer', desc: 'KI empfiehlt Restaurants mit starkem digitalem Ruf. Pr\u00fcfe ob dein Profil komplett und konsistent ist.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <Icon size={20} className="text-primary mb-3" />
              <div className="font-medium text-white text-sm mb-1">{title}</div>
              <div className="text-gray-300 text-xs font-light leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 pt-24 sm:pt-44 pb-16 sm:pb-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
          H&auml;ufig gestellte Fragen
        </h2>
        <LandingFaq />
      </div>

      {/* FOOTER CTA */}
      <div className="border-t border-white/10 py-16 sm:py-32 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          Kennt ChatGPT den Ruf deines Restaurants?
        </h2>
        <UrlInputForm />
      </div>

      {/* Newsroom Link */}
      <div className="max-w-3xl mx-auto px-4 py-6 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <a href="https://ai-gastro-hub.vercel.app/newsroom" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
          <div className="w-[6px] h-[6px] rounded-full flex-shrink-0 mt-1" style={{ background: "#FF3CAC", boxShadow: "0 0 8px 2px #FF3CAC66" }} />
          <div className="flex flex-col">
            <div className="text-xs tracking-widest uppercase font-semibold" style={{ background: "linear-gradient(135deg, #FFB432 0%, #FF3CAC 50%, #FF2D78 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>KI-Gastro-Newsroom</div>
            <div className="text-xs mt-0.5" style={{ color: "#555" }}>Was KI f&uuml;r die Gastronomie bedeutet, jeden Montag neu</div>
          </div>
        </a>
      </div>
    </main>
  )
}
