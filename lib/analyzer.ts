import Anthropic from '@anthropic-ai/sdk'
import { ScrapedContent, GeoAnalysis, GeoScore, DimensionAction, GeoActionPlan } from '@/types/geo'

const MAX_CONTENT_FOR_CLAUDE = 3000 // Denial-of-Wallet Schutz

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function sanitizeContent(text: string): string {
  // Prompt Injection Schutz: bekannte Patterns entfernen
  let sanitized = text
  sanitized = sanitized.replace(/system\s*:/gi, '')
  sanitized = sanitized.replace(/\b(ignore|forget|disregard)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, '[REMOVED]')
  sanitized = sanitized.replace(/you\s+are\s+(now|a)\s+/gi, '')
  sanitized = sanitized.replace(/\bact\s+as\b/gi, '')
  sanitized = sanitized.replace(/<\/?script[^>]*>/gi, '')
  return sanitized.slice(0, MAX_CONTENT_FOR_CLAUDE)
}

export async function analyzeGeo(scraped: ScrapedContent): Promise<GeoAnalysis> {
  const sanitizedContent = sanitizeContent(scraped.bodyText)

  const prompt = `Analysiere diese Website für GEO (Generative Engine Optimization) — also wie gut die Seite von KI-Suchmaschinen wie ChatGPT, Perplexity und Google AI Overviews zitiert werden kann.

Website-URL: ${scraped.url}
Titel: ${scraped.title}
Description: ${scraped.description}
Headings: ${scraped.headings.slice(0, 10).join(', ')}
Hat JSON-LD Schema: ${scraped.hasJsonLd ? 'Ja' : 'Nein'}
Hat FAQ-Struktur: ${scraped.hasFaq ? 'Ja' : 'Nein'}
Hat Autor: ${scraped.hasAuthor ? 'Ja' : 'Nein'}
Hat Datum: ${scraped.hasDate ? 'Ja' : 'Nein'}
Hat externe Links: ${scraped.hasExternalLinks ? 'Ja' : 'Nein'}

Content (gekürzt):
${sanitizedContent}

Bewerte die Website in 5 GEO-Dimensionen und gib ein JSON-Objekt zurück:

1. schema (0-25): Schema Markup — JSON-LD, strukturierte Daten, Open Graph
2. structure (0-25): Content-Struktur — klare Überschriften, Absätze, Listen, FAQ-Format
3. statistics (0-20): Statistiken & Quellen — Zahlen, Studien, Quellenangaben, externe Links
4. eeat (0-20): E-E-A-T Signale — Autor sichtbar, Datum, Expertise, Vertrauenswürdigkeit
5. technical (0-10): Technische GEO — Ladezeit-Indikatoren, Mobile-Hints, Crawlability

Antworte NUR mit einem validen JSON-Objekt in diesem exakten Format:
{
  "dimensions": {
    "schema": <0-25>,
    "structure": <0-25>,
    "statistics": <0-20>,
    "eeat": <0-20>,
    "technical": <0-10>
  },
  "found": ["<was vorhanden ist, max 5 Einträge>"],
  "missing": ["<was fehlt, max 5 Einträge>"],
  "summary": "<2-3 Sätze Zusammenfassung auf Deutsch, verständlich für Nicht-Techniker>",
  "recommendations": ["<konkrete Handlungsempfehlung 1>", "<2>", "<3>", "<4>", "<5>"],
  "actionPlan": [
    {
      "title": "<Dimensions-Name in einfacher Sprache>",
      "score": "<X/maxScore>",
      "status": "<kritisch|verbesserung|gut>",
      "topFix": "<wichtigster Fix in 1 Satz>",
      "steps": ["<konkreter Schritt 1>", "<Schritt 2>"],
      "businessImpact": "<Warum wichtig, 1 Satz in Business-Sprache>",
      "effort": "<realistische Zeitschätzung: '30 Min' / '1-2 Std' / '1 Tag' / '1 Woche'>"
    }
  ],
  "industry": "Gib die Branche auf Deutsch zurück, max. 2 Wörter, kein Schrägstrich, kein Englisch. Beispiele: Zahnarzt, Handwerker, Online-Shop, Steuerberater. Fallback: 'Websites allgemein'",
  "language": "<erkannte Sprache: 'de' oder 'en'>"
}

Für actionPlan: genau 5 Einträge (einer pro Dimension), in der Reihenfolge: Maschinenlesbarkeit, Inhaltsstruktur, Fakten & Quellen, Vertrauenswürdigkeit, Technische Basis. Status: unter 40% = "kritisch", 40-70% = "verbesserung", über 70% = "gut".`

  // Retry-Logik: bei JSON-Parse Fehlern bis zu 2 Versuche
  type ParsedResponse = {
    dimensions: { schema: number; structure: number; statistics: number; eeat: number; technical: number }
    found: string[]
    missing: string[]
    summary: string
    recommendations: string[]
    actionPlan?: Array<{
      title: string
      score: string
      status: string
      topFix: string
      steps: string[]
      businessImpact: string
    }>
    industry: string
    language: string
  }

  let parsed: ParsedResponse | null = null
  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [
          { role: 'user', content: prompt },
        ],
      })

      const responseText = message.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map(block => block.text)
        .join('')

      // JSON aus Response extrahieren (auch wenn in Markdown-Codeblock)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Claude JSON-Parse Fehler: Kein JSON in Response gefunden')
      }

      parsed = JSON.parse(jsonMatch[0]) as ParsedResponse
      lastError = null
      break
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unbekannter Fehler')
      if (attempt === 0) continue
    }
  }

  if (!parsed) {
    throw lastError || new Error('Claude JSON-Parse Fehler')
  }

  // Validierung: Dimensionen in Range clampen
  const dims = {
    schema: Math.min(25, Math.max(0, Math.round(parsed.dimensions?.schema ?? 0))),
    structure: Math.min(25, Math.max(0, Math.round(parsed.dimensions?.structure ?? 0))),
    statistics: Math.min(20, Math.max(0, Math.round(parsed.dimensions?.statistics ?? 0))),
    eeat: Math.min(20, Math.max(0, Math.round(parsed.dimensions?.eeat ?? 0))),
    technical: Math.min(10, Math.max(0, Math.round(parsed.dimensions?.technical ?? 0))),
  }

  const score: GeoScore = {
    total: dims.schema + dims.structure + dims.statistics + dims.eeat + dims.technical,
    dimensions: dims,
  }

  // ActionPlan parsen und validieren
  let actionPlan: GeoActionPlan | undefined
  if (parsed.actionPlan && Array.isArray(parsed.actionPlan)) {
    const validStatuses = ['kritisch', 'verbesserung', 'gut'] as const
    const actions: DimensionAction[] = parsed.actionPlan.slice(0, 5).map(a => ({
      title: String(a.title || '').slice(0, 100),
      score: String(a.score || '').slice(0, 20),
      status: validStatuses.includes(a.status as typeof validStatuses[number])
        ? a.status as DimensionAction['status']
        : 'verbesserung',
      topFix: String(a.topFix || '').slice(0, 200),
      steps: (a.steps || []).slice(0, 3).map(s => String(s).slice(0, 200)),
      businessImpact: String(a.businessImpact || '').slice(0, 200),
      effort: String((a as Record<string, unknown>).effort || '1-2 Std').slice(0, 20),
    }))
    actionPlan = {
      summary: (parsed.summary || 'Analyse abgeschlossen.').slice(0, 500),
      actions,
    }
  }

  return {
    url: scraped.url,
    score,
    found: (parsed.found || []).slice(0, 5),
    missing: (parsed.missing || []).slice(0, 5),
    summary: (parsed.summary || 'Analyse abgeschlossen.').slice(0, 500),
    recommendations: (parsed.recommendations || []).slice(0, 7),
    actionPlan,
    industry: (parsed.industry || 'Websites allgemein').slice(0, 50),
    language: parsed.language === 'en' ? 'en' : 'de',
    scannedAt: new Date().toISOString(),
  }
}
