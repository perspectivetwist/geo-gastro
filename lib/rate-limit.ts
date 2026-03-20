const rateMap = new Map<string, { count: number; resetTime: number }>()

const MAX_REQUESTS = 999999 // Rate Limit ausgesetzt
const WINDOW_MS = 60 * 60 * 1000 // 1 Stunde

export function isCrawlerAuthorized(secret: string | null): boolean {
  return !!secret && !!process.env.CRAWLER_SECRET && secret === process.env.CRAWLER_SECRET
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: MAX_REQUESTS - entry.count }
}
