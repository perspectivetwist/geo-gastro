import Anthropic from '@anthropic-ai/sdk'

function cleanApiKey(key: string | undefined): string | undefined {
  if (!key) return undefined
  return key.replace(/^["']+|["']+$/g, '').replace(/\\n/g, '').trim()
}

export interface KiSummary {
  zusammenfassung: string
}

function sanitizeInput(text: string): string {
  let sanitized = text
  sanitized = sanitized.replace(/ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?)/gi, '[REMOVED]')
  sanitized = sanitized.replace(/you\s+are\s+(now|a)\s+/gi, '[REMOVED]')
  sanitized = sanitized.replace(/system\s*:\s*/gi, '[REMOVED]')
  sanitized = sanitized.replace(/<\/?(?:script|style|iframe|object|embed|form|input)[^>]*>/gi, '[REMOVED]')
  return sanitized.slice(0, 8000)
}

function validateOutput(summary: KiSummary): KiSummary {
  const clean = summary.zusammenfassung
    .replace(/<[^>]+>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim()
  return { zusammenfassung: clean }
}

export async function generateKiSummary(
  url: string,
  befunde: string
): Promise<KiSummary | null> {
  const apiKey = cleanApiKey(process.env.ANTHROPIC_API_KEY)
  if (!apiKey) return null

  const client = new Anthropic({ apiKey })

  const restaurantName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '')

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: 'Du bist ein KI-Berater für Restaurantbesitzer. Die gescannte URL ist IMMER ein Restaurant, egal was der Website-Inhalt zeigt. Schreibe IMMER über ein Restaurant, nie über Auktionen, Domains oder andere Branchen. Übersetze technische Scan-Befunde in verständliche, direkte Sprache für Nicht-Techniker. Kein Tech-Jargon. Keine Fachbegriffe. KEINE Gedankenstriche (weder — noch –), nur Punkte und Kommas. 4 kurze Absätze, je 1-2 Sätze, gesamt ca. 180-220 Wörter. Ton: ruhig, direkt, leicht beunruhigend. Kein Alarmismus. Kein Werbesprech. Antworte NUR mit: { "zusammenfassung": "Gesamter Text als EIN String. Absätze getrennt durch \\n\\n." }',
    messages: [
      {
        role: 'user',
        content: `Restaurant: ${restaurantName} | Befunde: ${sanitizeInput(befunde)} | Antworte EXAKT so: { "zusammenfassung": "Abs.1: Was KI-Systeme heute über dieses Restaurant wissen und was fehlt.\\n\\nAbs.2: Welche Gäste dadurch verloren gehen weil KI das Restaurant nicht empfehlen kann.\\n\\nAbs.3: Wie ein vollständiges KI-Profil aussieht.\\n\\nAbs.4: Was der Aktionsplan darunter konkret schließt. Keine Gedankenstriche." }`,
      },
    ],
  })

  const responseText = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('')

  // Strip markdown code fences if present
  const cleaned = responseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) return null

  try {
    const raw = JSON.parse(match[0])
    if (raw.zusammenfassung && typeof raw.zusammenfassung === 'string') {
      return validateOutput({ zusammenfassung: raw.zusammenfassung })
    }
    const source = (raw.beratung as Record<string, unknown>) || raw
    const paragraphs: string[] = []
    for (let i = 1; i <= 6; i++) {
      const val = source[`absatz_${i}`]
      if (val && typeof val === 'string') paragraphs.push(val)
    }
    if (paragraphs.length > 0) {
      return validateOutput({ zusammenfassung: paragraphs.join('\n\n') })
    }
  } catch {
    const valueMatch = cleaned.match(/"zusammenfassung"\s*:\s*"([\s\S]*)"/)
    if (valueMatch) {
      return validateOutput({ zusammenfassung: valueMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') })
    }
    const paragraphs: string[] = []
    for (let i = 1; i <= 6; i++) {
      const absMatch = cleaned.match(new RegExp(`"absatz_${i}"\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)"`, 's'))
      if (absMatch) paragraphs.push(absMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'))
    }
    if (paragraphs.length > 0) {
      return validateOutput({ zusammenfassung: paragraphs.join('\n\n') })
    }
  }

  return null
}
