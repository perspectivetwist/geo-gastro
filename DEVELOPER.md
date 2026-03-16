# GEO Gastro Scanner – Developer Documentation

## Setup
```bash
npm install
cp .env.example .env.local  # ENV-Variablen eintragen
npm run dev                  # http://localhost:3000
```

## ENV-Variablen
| Variable | Beschreibung |
|----------|-------------|
| ANTHROPIC_API_KEY | Claude Haiku API Key |
| JINA_API_KEY | Jina.ai Reader API Key |
| NOTION_TOKEN | Notion Integration Token |
| NOTION_GEO_LEADS_DB_ID | Notion GEO Leads DB ID |

## Deployment
```bash
npx vercel --prod --yes
```
Vercel URL: https://geo-gastro.vercel.app

## Architektur
- `/` — Landing Page mit URL-Input
- `/scanning` — Ladescreen mit Animation
- `/results` — Score + Report + Email-Gate
- `/api/scan` — POST: URL → Jina scrape → Claude Analyse → GEO Score
- `/api/capture-lead` — POST: Email → Notion Leads DB

## Wichtige Dateien
| Datei | Zweck |
|-------|-------|
| app/page.tsx | Landing Page |
| app/scanning/page.tsx | Ladescreen |
| app/results/page.tsx | Ergebnis-Seite |
| app/api/scan/route.ts | Scan-Endpoint |
| components/LandingFaq.tsx | FAQ-Accordion (9 Fragen) |
| components/Footer.tsx | Ökosystem-Footer |
| lib/scraper.ts | Jina.ai Wrapper |
| lib/analyzer.ts | Claude Haiku GEO-Analyse |
