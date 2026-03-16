import { ScrapedContent } from '@/types/geo'

const SCRAPE_TIMEOUT_MS = 10000
const MAX_CONTENT_LENGTH = 10000

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  const jinaUrl = `https://r.jina.ai/${url}`

  let response: Response
  try {
    response = await fetch(jinaUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'Accept': 'text/plain',
      },
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new Error('Jina.ai Timeout: Website antwortet nicht innerhalb von 10 Sekunden')
    }
    throw new Error(`Jina.ai Fehler: ${err instanceof Error ? err.message : 'Verbindung fehlgeschlagen'}`)
  }

  if (!response.ok) {
    throw new Error(`Jina.ai Fehler: ${response.status} ${response.statusText}`)
  }

  const text = await response.text()

  if (!text || text.trim().length < 50) {
    throw new Error('Jina.ai: Kein verwertbarer Content auf dieser Seite gefunden')
  }

  // Titel: erste H1-Überschrift
  const titleMatch = text.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : url

  // Description: erster nicht-Heading Absatz mit > 50 Zeichen
  const descMatch = text.match(/^(?!#)(.{50,200})/m)
  const description = descMatch ? descMatch[1].trim() : ''

  // Headings: alle H1-H3
  const headingMatches = text.match(/^#{1,3}\s+.+$/gm) || []
  const headings = headingMatches.map(h => h.replace(/^#+\s+/, '').trim())

  // Schema Markup (JSON-LD)
  const hasJsonLd = text.includes('"@context"') || text.includes('"@type"')
  const schemaMatch = text.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)
  const schemaMarkup = schemaMatch ? schemaMatch[1].trim() : null

  // FAQ-Struktur
  const hasFaq = /\b(FAQ|Häufig|frequently asked|fragen)\b/i.test(text) ||
                 (text.match(/\?/g) || []).length >= 5

  // Autor sichtbar
  const hasAuthor = /\b(autor|author|von|by|geschrieben|verfass)/i.test(text)

  // Datum vorhanden
  const hasDate = /\b(202[0-9]|januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text)

  // Externe Links
  const hasExternalLinks = (text.match(/https?:\/\//g) || []).length > 2

  return {
    url,
    title,
    description,
    bodyText: text.slice(0, MAX_CONTENT_LENGTH),
    headings,
    hasJsonLd,
    schemaMarkup,
    hasFaq,
    hasAuthor,
    hasDate,
    hasExternalLinks,
  }
}
