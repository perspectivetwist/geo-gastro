# Rate Limiting: Upstash Redis via Vercel KV

## Problem
In-Memory Rate Limiter (Map) funktioniert nicht auf Vercel Serverless — jede Function-Invocation startet mit leerem Speicher. Crawler-Script (crawl-cities.js) hat am 23.03.2026 ~36M Jina-Tokens verbraucht, alle Scanner lahmgelegt.

## Lösung
- @upstash/redis + @upstash/ratelimit mit Vercel KV (shared Redis Store)
- Sliding Window: 2 Scans/Stunde pro IP
- IP-Whitelist via RATE_LIMIT_WHITELIST_IPS ENV
- Crawler-Secret Bypass bleibt aktiv
- Graceful Degradation: ohne Redis → kein Rate Limiting (statt Fehler)

## ENV-Variablen (neu)
- KV_REST_API_URL — Vercel KV / Upstash Redis URL
- KV_REST_API_TOKEN — Vercel KV / Upstash Redis Token
- RATE_LIMIT_WHITELIST_IPS — Komma-separierte IP-Liste

## Geänderte Dateien
- lib/rate-limit.ts — Komplett neu (Upstash statt In-Memory)
- app/api/scan/route.ts — checkRateLimit jetzt async (await)
- package.json — @upstash/redis + @upstash/ratelimit hinzugefügt

## Was funktioniert hat
- Vercel KV über CLI provisioniert und mit allen 8 Projekten geteilt
- Ein Redis-Store für alle Scanner (shared rate limiting)

## Was vermeiden
- echo statt printf bei vercel env add (Newline-Bug)
- In-Memory Maps für Zustand in Serverless

## Nächstes Mal
- Immer printf statt echo für ENV-Werte über CLI
- Rate Limiting von Anfang an mit persistentem Store planen

