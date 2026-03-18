import { ScrapedContent } from '@/types/geo'

const SCRAPE_TIMEOUT_MS = 20000
const AUTH_TIMEOUT_MS = 8000
const MAX_CONTENT_LENGTH = 10000

function cleanEnvKey(key: string | undefined): string | undefined {
  if (!key) return undefined
  return key.replace(/^["']+|["']+$/g, '').replace(/\\n/g, '').trim()
}

async function fetchJina(targetUrl: string, useAuth: boolean): Promise<Response> {
  const jinaUrl = `https://r.jina.ai/${targetUrl}`
  const headers: Record<string, string> = { 'Accept': 'text/plain' }
  const jinaKey = cleanEnvKey(process.env.JINA_API_KEY)
  if (useAuth && jinaKey) {
    headers['Authorization'] = `Bearer ${jinaKey}`
  }
  const timeout = useAuth ? AUTH_TIMEOUT_MS : SCRAPE_TIMEOUT_MS
  return fetch(jinaUrl, { headers, signal: AbortSignal.timeout(timeout) })
}

async function fetchWithFallbacks(url: string): Promise<Response> {
  const hasKey = !!cleanEnvKey(process.env.JINA_API_KEY)
  const urls = [url]
  if (url.startsWith('https://')) {
    urls.push(url.replace('https://', 'http://'))
  }

  // Versuch 1: Mit Auth-Key (kurzer Timeout falls Key ungültig)
  if (hasKey) {
    for (const targetUrl of urls) {
      try {
        const res = await fetchJina(targetUrl, true)
        if (res.ok) return res
        if (res.status === 401) break // Key ungültig → direkt zu ohne-Key
        if (res.status === 422) continue // SSL-Fehler → HTTP versuchen
        return res
      } catch {
        break // Timeout/Netzwerk → direkt zu ohne-Key
      }
    }
  }

  // Versuch 2: Ohne Auth-Key (Free Tier, voller Timeout)
  for (const targetUrl of urls) {
    try {
      const res = await fetchJina(targetUrl, false)
      if (res.ok) return res
      if (res.status === 422) continue // SSL-Fehler → HTTP versuchen
      return res
    } catch (err) {
      if (targetUrl === urls[urls.length - 1]) throw err
      continue
    }
  }

  throw new Error('Jina.ai Fehler: Alle Versuche fehlgeschlagen')
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  let response: Response
  try {
    response = await fetchWithFallbacks(url)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Verbindung fehlgeschlagen'
    if (msg.includes('TimeoutError') || msg.includes('timeout') || msg.includes('Timeout')) {
      throw new Error('Jina.ai Timeout: Website antwortet nicht innerhalb von 20 Sekunden')
    }
    throw new Error(`Jina.ai Fehler: ${msg}`)
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
