'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Shield, Zap, MapPin } from 'lucide-react'

const faqItems = [
  {
    question: 'Was ist GEO für Restaurants?',
    answer: 'GEO (Generative Engine Optimization) bedeutet: Kennen KI-Systeme wie ChatGPT den Ruf deines Restaurants? Dazu zählen deine Google-Bewertungen, Erwähnungen in Restaurantführern, Brancheneinträge und Social-Media-Präsenz. Wer dort fehlt, wird von KI nicht empfohlen.',
    alwaysOpen: true,
  },
  {
    question: 'Was prüft der GEO-Scanner?',
    answer: 'Wir prüfen 6 Reputations-Dimensionen: Google Business Profile Vollständigkeit, Bewertungsanzahl und -qualität, Erwähnungen in relevanten Verzeichnissen, Social-Media-Präsenz, Presse-Erwähnungen und Konsistenz deiner Unternehmensdaten über alle Plattformen.',
  },
  {
    question: 'Was ist der Unterschied zwischen AEO und GEO?',
    answer: 'AEO optimiert deine Website für KI-Lesbarkeit. GEO optimiert deinen Ruf im Internet. Ein Restaurant braucht beides: eine KI-lesbare Website (AEO) UND einen starken digitalen Ruf (GEO). Nur dann empfiehlt ChatGPT dein Restaurant.',
  },
  {
    question: 'Mein Restaurant hat 200 Google-Bewertungen. Ist mein GEO-Score gut?',
    answer: 'Nicht unbedingt. GEO misst mehr als nur Bewertungsanzahl. Wenn du auf TripAdvisor nicht gelistet bist, kein vollständiges Google Business Profile hast oder deine Öffnungszeiten auf verschiedenen Plattformen widersprüchlich sind — verlierst du GEO-Punkte trotz guter Bewertungen.',
  },
  {
    question: 'Was kostet der GEO-Scan?',
    answer: 'Kostenlos. Den vollständigen Aktionsplan mit priorisierten Verbesserungen gibt es nach Email-Eingabe.',
  },
]

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {faqItems.map((item, i) => {
        const isOpen = item.alwaysOpen || openIndex === i
        return (
          <div
            key={i}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                if (item.alwaysOpen) return
                setOpenIndex(openIndex === i ? null : i)
              }}
              className={`w-full flex items-center justify-between p-4 sm:p-6 text-left ${item.alwaysOpen ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="font-medium text-white text-sm pr-4">{item.question}</span>
              {!item.alwaysOpen && (
                isOpen
                  ? <ChevronUp size={18} className="text-primary shrink-0" />
                  : <ChevronDown size={18} className="text-primary shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-2">
                <p className="text-gray-300 text-sm font-light leading-relaxed whitespace-pre-line">
                  {item.answer}
                </p>
                {item.alwaysOpen && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Shield size={14} className="text-primary" />
                      DSGVO-konform
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Zap size={14} className="text-primary" />
                      Ergebnis in 20 Sek.
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary" />
                      Made in Germany
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
