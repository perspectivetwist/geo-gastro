import { ScrapedContent, GeoScore } from '@/types/geo'

// --- 1. Schema Markup (0-25) ---
export function scoreSchema(scraped: ScrapedContent): number {
  let score = 0

  if (scraped.hasJsonLd) {
    const highValueTypes = /FAQPage|Article|Organization|HowTo|Product|LocalBusiness/i
    const schemaSource = scraped.schemaMarkup || scraped.bodyText
    score = highValueTypes.test(schemaSource) ? 25 : 12
  }

  // Open Graph Bonus
  if (/og:title|og:description|og:image/i.test(scraped.bodyText)) {
    score = Math.min(25, score + 5)
  }

  return score
}

// --- 2. Content-Struktur (0-25) ---
export function scoreStructure(scraped: ScrapedContent): number {
  let score = 0

  // Headings
  if (scraped.headings.length >= 5) score += 8
  else if (scraped.headings.length >= 2) score += 4

  // FAQ-Struktur
  if (scraped.hasFaq) score += 7

  // Listen (Markdown-Listen: - oder * gefolgt von mindestens 10 Zeichen)
  const listItems = (scraped.bodyText.match(/^[-*]\s.{10,}/gm) || []).length
  if (listItems >= 3) score += 5

  // Absätze > 50 Zeichen (kein Heading, nicht leer)
  const paragraphs = scraped.bodyText
    .split('\n')
    .filter(p => p.trim().length > 50 && !p.trim().startsWith('#'))
  if (paragraphs.length >= 3) score += 5

  return Math.min(25, score)
}

// --- 3. Statistiken & Quellen (0-20) ---
export function scoreStatistics(scraped: ScrapedContent): number {
  let score = 0

  // Zahlen/Statistiken
  const statsMatches = (scraped.bodyText.match(/\d+[%€$]|\d+\.\d+/g) || []).length
  if (statsMatches >= 3) score += 8

  // Externe Links
  if (scraped.hasExternalLinks) score += 6

  // Zitat-Patterns
  if (/Studie|Quelle|laut|according|study|Forschung|Untersuchung|Statistik/i.test(scraped.bodyText)) {
    score += 6
  }

  return Math.min(20, score)
}

// --- 4. E-E-A-T Signale (0-20) ---
export function scoreEeat(scraped: ScrapedContent): number {
  let score = 0

  if (scraped.hasAuthor) score += 8
  if (scraped.hasDate) score += 6

  // Expertise-Signale
  if (/Experte|Spezialist|Dr\.|Prof\.|zertifiziert|certified|Fachmann|Sachverständig/i.test(scraped.bodyText)) {
    score += 3
  }

  if (scraped.hasExternalLinks) score += 3

  return Math.min(20, score)
}

// --- 5. Technische GEO (0-10) ---
export function scoreTechnical(scraped: ScrapedContent): number {
  let score = 0

  // Title-Länge
  const titleLen = scraped.title.length
  if (titleLen >= 30 && titleLen <= 60) score += 3
  else if (titleLen > 0) score += 1

  // Description-Länge
  const descLen = scraped.description.length
  if (descLen >= 120 && descLen <= 155) score += 3
  else if (descLen > 0) score += 1

  // JSON-LD vorhanden (Crawlability)
  if (scraped.hasJsonLd) score += 2

  // Headings vorhanden (strukturierte Seite)
  if (scraped.headings.length > 0) score += 2

  return Math.min(10, score)
}

// --- Gesamt-Score ---
export function calculateGeoScore(scraped: ScrapedContent): GeoScore {
  const dimensions = {
    schema: scoreSchema(scraped),
    structure: scoreStructure(scraped),
    statistics: scoreStatistics(scraped),
    eeat: scoreEeat(scraped),
    technical: scoreTechnical(scraped),
  }

  return {
    total: dimensions.schema + dimensions.structure + dimensions.statistics + dimensions.eeat + dimensions.technical,
    dimensions,
  }
}
