export default function JsonLdSchema() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Shift Drift",
    "url": "https://ai-gastro-hub.vercel.app",
    "sameAs": ["https://github.com/perspectivetwist"]
  }

  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GEO Gastro Scanner",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
  }

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Verliere ich wirklich Gäste durch KI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, still und leise. Wenn jemand ChatGPT fragt \"Welches italienische Restaurant ist gut in München-Schwabing?\" und dein Restaurant nicht in der Antwort erscheint, existierst du für diesen potenziellen Gast nicht. Das passiert heute schon millionenfach täglich."
        }
      },
      {
        "@type": "Question",
        "name": "Warum gibt es den GEO Scanner und warum jetzt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Weil Restaurants online unsichtbar werden, ohne es zu merken. ChatGPT empfiehlt keine Restaurants, die es nicht kennt. Es empfiehlt Betriebe mit starkem digitalem Ruf: Bewertungen, Erwähnungen, Branchenprofile. 63% aller Websites erhalten bereits Traffic von KI-Suchmaschinen (Ahrefs 2025). 58% der Konsumenten haben Google durch KI-Tools ersetzt für Produkt- und Servicesuche (Capgemini 2025). +527% Anstieg KI-generierter Website-Referrals in nur 5 Monaten (Previsible Jan-Mai 2025). 800 Mio. wöchentliche ChatGPT-Nutzer, Stand Ende 2025 (OpenAI). Kombination aus Struktur + Statistiken = stärkste KI-Sichtbarkeits-Intervention (Princeton GEO-Bench Paper). Der GEO Scanner zeigt in Sekunden wie stark der digitale Ruf deines Restaurants in den Augen von KI-Systemen ist."
        }
      },
      {
        "@type": "Question",
        "name": "Mein Restaurant läuft gut. Warum soll ich mir Sorgen machen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Weil Google-Rankings und KI-Sichtbarkeit zwei verschiedene Systeme sind. Dein Restaurant kann auf Seite 1 bei Google stehen und trotzdem von ChatGPT, Perplexity & Co. komplett ignoriert werden. KI zitiert nach anderen Regeln."
        }
      },
      {
        "@type": "Question",
        "name": "Was macht der GEO Scanner genau?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Er analysiert deine Restaurant-Website auf 5 Signale die KI-Assistenten nutzen um Quellen auszuwählen: Struktur, Schema-Daten, Fakten, Expertise-Signale und technische Zugänglichkeit. Du bekommst einen Score von 0-100 und siehst wo dein Restaurant steht."
        }
      },
      {
        "@type": "Question",
        "name": "Was ist der Unterschied zu SEO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SEO optimiert für Google-Klicks. GEO optimiert dafür, dass KI-Assistenten dein Restaurant als Quelle zitieren. Beides ist wichtig, aber es sind verschiedene Spiele mit verschiedenen Regeln."
        }
      },
      {
        "@type": "Question",
        "name": "Was bedeutet mein GEO-Score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Er zeigt wie wahrscheinlich es ist, dass KI-Assistenten dein Restaurant als vertrauenswürdige Quelle erkennen. Unter 50: dringende Baustellen. 50-75: Potenzial vorhanden. Über 75: gut aufgestellt."
        }
      },
      {
        "@type": "Question",
        "name": "Ich habe schon SEO. Warum brauche ich das noch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Weil 58% der Nutzer KI bereits statt Google nutzen für Restaurant- und Servicefindung (Capgemini 2025). SEO allein reicht nicht mehr. GEO ist die nächste Schicht."
        }
      },
      {
        "@type": "Question",
        "name": "Ist das auch für kleine Restaurants sinnvoll?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gerade dann. Große Ketten werden von KI oft automatisch genannt. Kleine und mittlere Gastronomiebetriebe müssen aktiv die richtigen Signale setzen, sonst werden sie übergangen."
        }
      },
      {
        "@type": "Question",
        "name": "Was mache ich mit dem Report?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Du bekommst konkrete Aufgaben pro Bereich, ohne Fachbegriffe. Entweder selbst umsetzen oder deinem Webentwickler schicken. Die meisten Fixes sind in 1-2 Stunden erledigt."
        }
      }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}
