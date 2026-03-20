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
    max_tokens: 300,
    system: 'Du bist ein KI-Berater für Restaurantbesitzer. Übersetze technische Scan-Befunde in einfache, direkte Sprache. Kein Tech-Jargon. 3-4 Sätze, max. 60 Wörter. Ton: direkt, konkret, leicht beunruhigend. Antworte NUR mit JSON, kein Text davor oder danach.',
    messages: [
      {
        role: 'user',
        content: `Restaurant: ${restaurantName} | Befunde: ${sanitizeInput(befunde)} | JSON: { "zusammenfassung": "3-4 Sätze: Was KI-Systeme über dieses Restaurant wissen — und was fehlt damit das Profil vollständig ist." }`,
      },
    ],
  })

  const responseText = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('')

  const match = responseText.match(/\{[\s\S]*\}/)
  if (!match) return null

  const parsed = JSON.parse(match[0]) as KiSummary
  if (!parsed.zusammenfassung || typeof parsed.zusammenfassung !== 'string') return null

  return validateOutput(parsed)
}
