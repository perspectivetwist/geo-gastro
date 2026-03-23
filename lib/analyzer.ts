import { ScrapedContent, GeoAnalysis, GeoScore, DimensionAction, GeoActionPlan } from '@/types/geo'
import { calculateGeoScore } from './scorer'

const MAX_CONTENT_FOR_CLAUDE = 3000

function cleanApiKey(key: string | undefined): string | undefined {
  if (!key) return undefined
  return key.replace(/^["']+|["']+$/g, '').replace(/\\n/g, '').trim()
}

function sanitizeContent(text: string): string {
  let sanitized = text
  sanitized = sanitized.replace(/system\s*:/gi, '')
  sanitized = sanitized.replace(/\b(ignore|forget|disregard)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, '[REMOVED]')
  sanitized = sanitized.replace(/you\s+are\s+(now|a)\s+/gi, '')
  sanitized = sanitized.replace(/\bact\s+as\b/gi, '')
  sanitized = sanitized.replace(/<\/?script[^>]*>/gi, '')
  return sanitized.slice(0, MAX_CONTENT_FOR_CLAUDE)
}

// --- Branchen-Erkennung (regelbasiert) ---

const INDUSTRY_KEYWORDS: [RegExp, string][] = [
  [/zahnarzt|zahnärzt|dental|zahnklinik|zahnmedizin/i, 'Zahnarzt'],
  [/arzt|ärzt|praxis|medizin|klinik|krankenhaus|chirurg|orthopäd|kardiol|dermatol|therapeut|physiotherap/i, 'Arztpraxis'],
  [/apotheke|pharma/i, 'Apotheke'],
  [/anwalt|anwält|kanzlei|rechtsanwalt|notar|jurist/i, 'Rechtsanwalt'],
  [/steuerberater|steuerkanzlei|steuerberatung|buchhalt|wirtschaftsprüf/i, 'Steuerberater'],
  [/immobili|makler|hausverwaltung|wohnung/i, 'Immobilien'],
  [/restaurant|gastronomie|gastro|bistro|café|catering|speisekarte|küche|koch|essen|menü/i, 'Gastronomie'],
  [/hotel|pension|ferienwohnung|unterkunft|übernacht/i, 'Hotellerie'],
  [/handwerk|elektriker|klempner|maler|tischler|schreiner|dachdecker|sanitär|heizung|installat/i, 'Handwerker'],
  [/friseur|frisör|salon|kosmetik|beauty|nail|wellness|spa|massage/i, 'Beauty & Wellness'],
  [/auto|kfz|werkstatt|fahrzeug|reifen|automobil|porsche|bmw|mercedes|audi|volkswagen|toyota/i, 'Automobilbranche'],
  [/versicherung|finanz|bank|kredit|vermögen|invest|anlage/i, 'Finanzdienstleister'],
  [/architekt|bau|bauunternehm|ingenieurbüro/i, 'Architektur & Bau'],
  [/fotograf|photo|video|film|medien|agentur|werbeagentur|marketing/i, 'Agentur & Medien'],
  [/software|saas|app|it-|tech|digital|cloud|hosting|webdesign|webentwickl|programmier/i, 'IT & Software'],
  [/shop|e-commerce|ecommerce|online-shop|onlineshop|warenkorb|bestell/i, 'Online-Shop'],
  [/coach|beratung|consulting|berater|trainer|schulung|seminar|weiterbildung/i, 'Beratung & Coaching'],
  [/logistik|transport|spedition|umzug|liefer/i, 'Logistik & Transport'],
  [/reinigung|gebäudereinigung|hausmeister|facility/i, 'Gebäudeservice'],
  [/garten|landschaft|gärtner|florist|blumen/i, 'Garten & Landschaft'],
  [/tierarzt|tierärzt|tierklinik|tierheim|haustier/i, 'Tierarzt'],
  [/fitness|sport|gym|personal train/i, 'Fitness & Sport'],
  [/mode|fashion|bekleidung|textil|schmuck|juwelier/i, 'Mode & Schmuck'],
  [/reise|tourismus|travel|touristik|urlaub/i, 'Reise & Tourismus'],
  [/bildung|schule|universität|hochschule|kita|kindergarten/i, 'Bildung'],
  [/energie|solar|photovoltaik|strom|wärmepumpe/i, 'Energie'],
  [/optik|optiker|augenarzt|brille|kontaktlinse/i, 'Optiker'],
  [/verein|stiftung|gemeinnütz|ngo/i, 'Verein & Stiftung'],
  [/musik|musiker|band|instrument|konzert/i, 'Musik'],
  [/sicherheit|security|bewachung|detektiv/i, 'Sicherheit'],
]

function detectIndustry(scraped: ScrapedContent): string {
  const searchText = `${scraped.title} ${scraped.description} ${scraped.bodyText.slice(0, 2000)}`
  for (const [pattern, label] of INDUSTRY_KEYWORDS) {
    if (pattern.test(searchText)) return label
  }
  return 'Websites allgemein'
}

// --- Fallback-Report (ohne Claude) ---

interface ReportData {
  found: string[]
  missing: string[]
  summary: string
  recommendations: string[]
  actionPlan: GeoActionPlan
  industry: string
  language: string
}

function getDimStatus(score: number, maxScore: number): DimensionAction['status'] {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct < 40) return 'kritisch'
  if (pct < 70) return 'verbesserung'
  return 'gut'
}

const DIMENSION_HINTS: Record<string, { topFix: string; steps: string[]; businessImpact: string; effort: string }> = {
  schema: {
    topFix: 'JSON-LD Schema Markup (FAQPage oder Article) zur Website hinzufügen.',
    steps: ['Schema.org FAQPage oder Article JSON-LD erstellen', 'Im <head> der Seite einbinden', 'Mit Google Rich Results Test validieren'],
    businessImpact: 'Strukturierte Daten helfen KI-Suchmaschinen, deine Inhalte korrekt zu verstehen und zu zitieren.',
    effort: '1-2 Std',
  },
  structure: {
    topFix: 'Inhalte mit klaren Überschriften (H1-H3), Absätzen und einer FAQ-Sektion gliedern.',
    steps: ['Klare H1-H3 Überschriften-Hierarchie aufbauen', 'FAQ-Sektion mit den 5 häufigsten Kundenfragen ergänzen', 'Inhalte in kurze Absätze und Listen aufteilen'],
    businessImpact: 'Gut gegliederte Inhalte werden von ChatGPT & Co. leichter erfasst und häufiger zitiert.',
    effort: '1-2 Std',
  },
  statistics: {
    topFix: 'Aussagen mit konkreten Zahlen, Studien oder externen Quellen belegen.',
    steps: ['Branchenstatistiken und Kennzahlen in Texte einbauen', 'Externe Quellen und Studien verlinken', 'Eigene Erfahrungswerte mit Zahlen untermauern'],
    businessImpact: 'KI-Systeme bevorzugen belegte Aussagen gegenüber unbelegten Behauptungen.',
    effort: '2-3 Std',
  },
  eeat: {
    topFix: 'Autorenangabe (Name + Rolle) und Veröffentlichungsdatum auf der Seite sichtbar machen.',
    steps: ['Autor mit Name, Rolle und kurzer Bio ergänzen', 'Veröffentlichungs- oder Aktualisierungsdatum anzeigen', 'Qualifikationen und Zertifizierungen nennen'],
    businessImpact: 'Sichtbare Expertise-Signale stärken das Vertrauen von KI-Systemen in deine Inhalte.',
    effort: '30 Min',
  },
  technical: {
    topFix: 'Meta-Title (30-60 Zeichen) und Meta-Description (120-155 Zeichen) optimieren.',
    steps: ['Meta-Title auf 30-60 Zeichen optimieren, Keyword einbauen', 'Meta-Description auf 120-155 Zeichen, Kernnutzen klar formulieren'],
    businessImpact: 'Optimierte Meta-Tags verbessern die Auffindbarkeit durch KI-Crawler.',
    effort: '15 Min',
  },
}

const DIMENSION_CONFIG: { key: string; title: string; maxScore: number }[] = [
  { key: 'schema', title: 'Maschinenlesbarkeit', maxScore: 25 },
  { key: 'structure', title: 'Inhaltsstruktur', maxScore: 25 },
  { key: 'statistics', title: 'Fakten & Quellen', maxScore: 20 },
  { key: 'eeat', title: 'Vertrauenswürdigkeit', maxScore: 20 },
  { key: 'technical', title: 'Technische Basis', maxScore: 10 },
]

function generateFallbackReport(scraped: ScrapedContent, score: GeoScore): ReportData {
  const industry = detectIndustry(scraped)

  const found: string[] = []
  const missing: string[] = []

  if (scraped.hasJsonLd) found.push('JSON-LD Schema vorhanden')
  else missing.push('Kein JSON-LD Schema gefunden')

  if (scraped.hasFaq) found.push('FAQ-Struktur erkannt')
  else missing.push('Keine FAQ-Struktur vorhanden')

  if (scraped.hasAuthor) found.push('Autor sichtbar')
  else missing.push('Kein Autor erkennbar')

  if (scraped.hasDate) found.push('Datum vorhanden')
  else missing.push('Kein Datum gefunden')

  if (scraped.hasExternalLinks) found.push('Externe Quellen verlinkt')
  else missing.push('Keine externen Links')

  if (scraped.headings.length >= 3) found.push('Klare Überschriften-Struktur')

  let band = 'kritisch'
  if (score.total >= 60) band = 'gut aufgestellt'
  else if (score.total >= 40) band = 'ausbaufähig'

  const summary = `Deine Website erreicht ${score.total}/100 GEO-Punkte — das ist ${band}. ${missing.length > 0 ? `Hauptpotenzial: ${missing.slice(0, 2).join(' und ')}.` : 'Weiter so!'}`

  const dims = score.dimensions as Record<string, number>
  const recommendations: string[] = []
  for (const dim of DIMENSION_CONFIG) {
    const pct = dims[dim.key] / dim.maxScore
    if (pct < 0.7) {
      recommendations.push(DIMENSION_HINTS[dim.key].topFix)
    }
  }

  const actions: DimensionAction[] = DIMENSION_CONFIG.map(dim => {
    const dimScore = dims[dim.key]
    const hints = DIMENSION_HINTS[dim.key]
    return {
      title: dim.title,
      score: `${dimScore}/${dim.maxScore}`,
      status: getDimStatus(dimScore, dim.maxScore),
      topFix: hints.topFix,
      steps: hints.steps,
      businessImpact: hints.businessImpact,
      effort: hints.effort,
    }
  })

  return {
    found: found.slice(0, 5),
    missing: missing.slice(0, 5),
    summary,
    recommendations: recommendations.slice(0, 5),
    actionPlan: { summary, actions },
    industry,
    language: 'de',
  }
}

// --- Claude Report (optional, non-fatal) ---

type ClaudeReport = {
  found: string[]
  missing: string[]
  summary: string
  recommendations: string[]
  actionPlan: GeoActionPlan
  industry: string
  language: string
}

async function generateReportViaClaude(
  scraped: ScrapedContent,
  score: GeoScore
): Promise<ClaudeReport | null> {
  const apiKey = cleanApiKey(process.env.ANTHROPIC_API_KEY)
  if (!apiKey) return null

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })

    const sanitizedContent = sanitizeContent(scraped.bodyText)

    const prompt = `Du bist ein GEO-Experte. Erstelle einen Report für diese Website.

URL: ${scraped.url}
Titel: ${scraped.title}
Headings: ${scraped.headings.slice(0, 10).join(', ')}

Bereits berechneter Score: ${score.total}/100
- Schema: ${score.dimensions.schema}/25
- Structure: ${score.dimensions.structure}/25
- Statistics: ${score.dimensions.statistics}/20
- E-E-A-T: ${score.dimensions.eeat}/20
- Technical: ${score.dimensions.technical}/10

Content (gekürzt):
${sanitizedContent}

Antworte NUR mit einem validen JSON-Objekt:
{
  "found": ["<was vorhanden ist, max 5 Einträge>"],
  "missing": ["<was fehlt, max 5 Einträge>"],
  "summary": "<2-3 Sätze Zusammenfassung auf Deutsch>",
  "recommendations": ["<Empfehlung 1>", "<2>", "<3>", "<4>", "<5>"],
  "actionPlan": [
    {
      "title": "<Dimensions-Name>",
      "score": "<X/maxScore>",
      "status": "<kritisch|verbesserung|gut>",
      "topFix": "<wichtigster Fix in 1 Satz>",
      "steps": ["<Schritt 1>", "<Schritt 2>"],
      "businessImpact": "<Warum wichtig>",
      "effort": "<30 Min / 1-2 Std / 1 Tag>"
    }
  ],
  "industry": "<Branche auf Deutsch, max 2 Wörter>",
  "language": "<de oder en>"
}

actionPlan: genau 5 Einträge (einer pro Dimension): Maschinenlesbarkeit, Inhaltsstruktur, Fakten & Quellen, Vertrauenswürdigkeit, Technische Basis.`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => 'text' in block ? block.text : '')
      .join('')

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0]) as {
      found?: string[]
      missing?: string[]
      summary?: string
      recommendations?: string[]
      actionPlan?: Array<{
        title: string
        score: string
        status: string
        topFix: string
        steps: string[]
        businessImpact: string
        effort?: string
      }>
      industry?: string
      language?: string
    }

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
        effort: String(a.effort || '1-2 Std').slice(0, 20),
      }))
      actionPlan = {
        summary: (parsed.summary || 'Analyse abgeschlossen.').slice(0, 500),
        actions,
      }
    }

    if (!actionPlan) return null

    return {
      found: (parsed.found || []).slice(0, 5),
      missing: (parsed.missing || []).slice(0, 5),
      summary: (parsed.summary || 'Analyse abgeschlossen.').slice(0, 500),
      recommendations: (parsed.recommendations || []).slice(0, 7),
      actionPlan,
      industry: (parsed.industry || 'Websites allgemein').slice(0, 50),
      language: parsed.language === 'en' ? 'en' : 'de',
    }
  } catch {
    return null
  }
}

// --- Haupt-Export ---

export async function analyzeGeo(scraped: ScrapedContent): Promise<GeoAnalysis> {
  const score = calculateGeoScore(scraped)

  const claudeReport = await generateReportViaClaude(scraped, score)
  const report = claudeReport ?? generateFallbackReport(scraped, score)

  return {
    url: scraped.url,
    score,
    found: report.found,
    missing: report.missing,
    summary: report.summary,
    recommendations: report.recommendations,
    actionPlan: report.actionPlan,
    industry: report.industry,
    language: report.language,
    scannedAt: new Date().toISOString(),
  }
}
