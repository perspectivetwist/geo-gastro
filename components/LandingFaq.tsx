'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Shield, Zap, MapPin } from 'lucide-react'

const faqItems = [
  {
    question: 'Was ist GEO und wozu brauche ich das als Restaurant?',
    answer: 'GEO (Generative Engine Optimization) sorgt dafür, dass ChatGPT den Ruf deines Restaurants kennt — Bewertungen, Erwähnungen, Brancheneinträge. Ohne GEO empfiehlt die KI die Konkurrenz.',
    alwaysOpen: true,
  },
  {
    question: 'Wie funktioniert der GEO Scanner für Restaurants?',
    answer: 'Du gibst deine Restaurant-URL oder deinen Namen ein. Der Scanner prüft ob ChatGPT dein Google-Profil, deine Bewertungen und deine Online-Präsenz kennt.',
  },
  {
    question: 'Was bedeutet KI-Reputation für mein Restaurant?',
    answer: 'KI-Reputation bedeutet: ChatGPT kennt deine 4,8-Sterne-Bewertungen und deine Küche — und empfiehlt dich aktiv wenn jemand nach einem Restaurant fragt.',
  },
  {
    question: 'Kostet der GEO Scanner etwas?',
    answer: 'Der Scan ist komplett kostenlos. Kein Account, keine Kreditkarte.',
  },
  {
    question: 'Was ist der Unterschied zwischen AEO und GEO?',
    answer: 'AEO optimiert ob KI deine Website lesen kann. GEO optimiert ob KI deinen Ruf kennt. Beide Hebel braucht dein Restaurant.',
  },
  {
    question: 'Wie verbessere ich die KI-Reputation meines Restaurants?',
    answer: 'Mehr Google-Bewertungen, konsistente Einträge (Google, Yelp, TripAdvisor), strukturierte Daten auf der Website. Der GEO Scanner zeigt wo die Lücken sind.',
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
