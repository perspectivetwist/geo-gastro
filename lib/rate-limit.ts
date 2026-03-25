import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Vercel KV (Upstash Redis) — shared across all serverless instances
const redis = process.env.KV_REST_API_URL
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, '1 h'),
      prefix: 'ratelimit',
    })
  : null

// Whitelisted IPs (comma-separated in ENV)
const WHITELISTED_IPS = (process.env.RATE_LIMIT_WHITELIST_IPS || '')
  .split(',')
  .map(ip => ip.trim())
  .filter(Boolean)

export function isCrawlerAuthorized(secret: string | null): boolean {
  return !!secret && !!process.env.CRAWLER_SECRET && secret === process.env.CRAWLER_SECRET
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  // Whitelisted IPs skip rate limiting
  if (WHITELISTED_IPS.includes(ip)) {
    return { allowed: true, remaining: 999 }
  }

  // Fallback if Upstash not configured
  if (!ratelimit) {
    return { allowed: true, remaining: 999 }
  }

  const { success, remaining } = await ratelimit.limit(ip)
  return { allowed: success, remaining }
}
