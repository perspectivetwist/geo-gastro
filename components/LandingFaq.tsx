'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Shield, Zap, MapPin } from 'lucide-react'

const faqItems = [
  {
    question: 'Verliere ich wirklich Kunden durch KI?',
    answer: 'Ja — still und leise. Wenn jemand ChatGPT fragt "Welcher Steuerberater ist gut in München?" und du nicht in der Antwort erscheinst, existierst du für diesen potenziellen Kunden nicht. Das passiert heute schon millionenfach täglich.',
    alwaysOpen: true,
  },
  {
    question: 'Warum gibt es den GEO Scanner und warum jetzt?',
    answer: 'Weil KMUs online unsichtbar werden — ohne es zu merken.\n\nChatGPT empfiehlt keine Websites, die es nicht kennt. Es empfiehlt Unternehmen mit starkem digitalem Ruf: Bewertungen, Erwähnungen, Branchenprofile. Die Zahlen:\n\n• 63% aller Websites erhalten bereits Traffic von KI-Suchmaschinen (Ahrefs 2025)\n• 58% der Konsumenten haben Google durch KI-Tools ersetzt für Produkt- und Servicesuche (Capgemini 2025)\n• +527% Anstieg KI-generierter Website-Referrals in nur 5 Monaten (Previsible Jan–Mai 2025)\n• 800 Mio. wöchentliche ChatGPT-Nutzer — Stand Ende 2025 (OpenAI)\n• Kombination aus Struktur + Statistiken = stärkste KI-Sichtbarkeits-Intervention (Princeton GEO-Bench Paper)\n\nDer GEO Scanner zeigt in Sekunden wie stark dein digitaler Ruf in den Augen von KI-Systemen ist.',
  },
  {
    question: 'Meine Website läuft gut — warum soll ich mir Sorgen machen?',
    answer: 'Weil Google-Rankings und KI-Sichtbarkeit zwei verschiedene Systeme sind. Du kannst auf Seite 1 bei Google stehen und trotzdem von ChatGPT, Perplexity & Co. komplett ignoriert werden. KI zitiert nach anderen Regeln.',
  },
  {
    question: 'Was macht der GEO Scanner genau?',
    answer: 'Er analysiert deine Website auf 5 Signale die KI-Assistenten nutzen um Quellen auszuwählen: Struktur, Schema-Daten, Fakten, Expertise-Signale und technische Zugänglichkeit. Du bekommst einen Score von 0–100 und siehst wo du stehst.',
  },
  {
    question: 'Was ist der Unterschied zu SEO?',
    answer: 'SEO optimiert für Google-Klicks. GEO optimiert dafür, dass KI-Assistenten dich als Quelle zitieren. Beides ist wichtig — aber es sind verschiedene Spiele mit verschiedenen Regeln.',
  },
  {
    question: 'Was bedeutet mein GEO-Score?',
    answer: 'Er zeigt wie wahrscheinlich es ist, dass KI-Assistenten deine Website als vertrauenswürdige Quelle erkennen. Unter 50: dringende Baustellen. 50–75: Potenzial vorhanden. Über 75: gut aufgestellt.',
  },
  {
    question: 'Ich habe schon SEO — warum brauche ich das noch?',
    answer: 'Weil 58% der Nutzer KI bereits statt Google nutzen für Produkt- und Servicefindung (Capgemini 2025). SEO allein reicht nicht mehr. GEO ist die nächste Schicht.',
  },
  {
    question: 'Ist das auch für kleine Websites sinnvoll?',
    answer: 'Gerade dann. Große Marken werden von KI oft automatisch genannt. Kleine und mittlere Unternehmen müssen aktiv die richtigen Signale setzen — sonst werden sie übergangen.',
  },
  {
    question: 'Was mache ich mit dem Report?',
    answer: 'Du bekommst konkrete Aufgaben pro Bereich — ohne Fachbegriffe. Entweder selbst umsetzen oder deinem Webentwickler schicken. Die meisten Fixes sind in 1–2 Stunden erledigt.',
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
