import { NextRequest, NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper'
import { analyzeGeo } from '@/lib/analyzer'
import { checkRateLimit, isCrawlerAuthorized } from '@/lib/rate-limit'
import { GeoAnalysis } from '@/types/geo'
import { generateKiSummary } from '@/lib/ki-summary'

export const maxDuration = 60
import { logScan } from '@/lib/notion'
import { pingIndexNow } from '@/lib/indexnow'

// SSRF-Schutz: Interne IPs und Hostnamen blocken
const BLOCKED_HOSTS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^169\.254\.\d+\.\d+$/,
  /^\[?::1\]?$/,
  /^\[?fe80:/i,
  /^\[?fc00:/i,
  /^\[?fd/i,
  /\.local$/i,
  /\.internal$/i,
]

function isBlockedHost(hostname: string): boolean {
  return BLOCKED_HOSTS.some(pattern => pattern.test(hostname))
}

export async function POST(request: NextRequest) {
  try {
    // Crawler-Bypass oder Rate Limiting
    const crawlerSecret = request.headers.get('x-crawler-secret')
    const skipRateLimit = isCrawlerAuthorized(crawlerSecret)

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    let remaining = 999
    if (!skipRateLimit) {
      const rateCheck = await checkRateLimit(ip)
      remaining = rateCheck.remaining
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { error: 'Zu viele Anfragen. Bitte in einer Stunde erneut versuchen.' },
          { status: 429 }
        )
      }
    }

    const body = await request.json() as { url: string }
    const { url } = body

    // Input-Validierung
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL fehlt oder ungültig' },
        { status: 400 }
      )
    }

    if (url.length > 2048) {
      return NextResponse.json(
        { error: 'URL zu lang (max 2048 Zeichen)' },
        { status: 400 }
      )
    }

    // URL normalisieren
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    let parsedUrl: URL
    try {
      parsedUrl = new URL(normalizedUrl)
    } catch {
      return NextResponse.json(
        { error: 'Ungültige URL. Beispiel: https://example.com' },
        { status: 400 }
      )
    }

    // Nur https erlauben
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Nur HTTPS URLs erlaubt' },
        { status: 400 }
      )
    }

    // SSRF-Schutz
    if (isBlockedHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: 'Diese URL kann nicht analysiert werden' },
        { status: 400 }
      )
    }

    // Pipeline: Scrape → Analyze
    const scraped = await scrapeUrl(normalizedUrl)
    const analysis: GeoAnalysis = await analyzeGeo(scraped)

    // KI-Zusammenfassung generieren (non-fatal)
    let kiSummary = undefined
    if (analysis.actionPlan) {
      try {
        const befunde = analysis.actionPlan.actions
          .map(a => `${a.title}: ${a.topFix}`)
          .join(' | ')
        kiSummary = await generateKiSummary(analysis.url, befunde)
      } catch (err) {
        console.error('KI-Summary error (non-fatal):', err)
      }
    }

    const previewResponse = {
      url: analysis.url,
      score: analysis.score,
      found: analysis.found,
      missing: analysis.missing,
      summary: analysis.summary,
      recommendations: analysis.recommendations,
      actionPlan: analysis.actionPlan,
      kiSummary,
      industry: analysis.industry,
      language: analysis.language,
      scannedAt: analysis.scannedAt,
    }

    // Scan in Notion loggen (fire-and-forget)
    logScan(analysis.url, analysis.score.total).catch(() => {})

    // IndexNow: Result-URL an Bing pushen (fire-and-forget)
    pingIndexNow(analysis.url)

    const response = NextResponse.json(previewResponse)
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    return response

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    console.error('Scan error:', message, error instanceof Error ? error.stack : '')

    if (message.includes('Jina.ai')) {
      return NextResponse.json(
        { error: 'Website konnte nicht geladen werden. Bitte URL prüfen.' },
        { status: 422 }
      )
    }

    if (message.includes('Claude') || message.includes('JSON-Parse') || message.includes('Anthropic') || message.includes('api_key') || message.includes('authentication')) {
      return NextResponse.json(
        { error: 'KI-Analyse fehlgeschlagen. Bitte erneut versuchen.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Interner Fehler. Bitte erneut versuchen.' },
      { status: 500 }
    )
  }
}
