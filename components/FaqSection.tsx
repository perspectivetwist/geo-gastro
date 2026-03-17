'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const resultsFaq = [
  {
    question: 'Was bedeutet mein GEO-Score?',
    answer: 'Der GEO-Score (0-100) zeigt, wie gut KI-Suchmaschinen deine Website als Quelle verwenden können. Je höher der Score, desto wahrscheinlicher wirst du von ChatGPT, Perplexity und Google AI Overviews zitiert.',
  },
  {
    question: 'Wie kann ich meinen Score verbessern?',
    answer: 'Folge den Handlungsempfehlungen im vollständigen Report. Die wichtigsten Hebel: strukturierte Daten (Schema Markup) hinzufügen, Content klar gliedern, Quellen und Statistiken einbauen, Autorenschaft sichtbar machen.',
  },
  {
    question: 'Wie oft sollte ich scannen?',
    answer: 'Nach jeder größeren Content-Änderung. Idealerweise alle 2-4 Wochen, um den Fortschritt zu messen.',
  },
  {
    question: 'Wird meine URL gespeichert?',
    answer: 'Nein. Die Analyse läuft in Echtzeit und wird nicht gespeichert. Nur wenn du deine Email eingibst, wird diese zusammen mit deinem Score in unserer Datenbank gesichert.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Häufige Fragen</h2>
      <div className="space-y-2">
        {resultsFaq.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i} className="border-b border-white/5 last:border-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{item.question}</span>
                {isOpen
                  ? <ChevronUp size={16} className="text-primary shrink-0" />
                  : <ChevronDown size={16} className="text-primary shrink-0" />
                }
              </button>
              {isOpen && (
                <p className="text-sm text-gray-300 font-light pb-3 -mt-1">
                  {item.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
