# CLAUDE.md — GEO Gastro Scanner

## Was ist dieses Projekt?
Gastro-Klon des GEO Scanners. Analysiert den digitalen Ruf von Restaurant-Websites für KI-Sichtbarkeit (Generative Engine Optimization). Teil des AI-Gastro-Hub Ökosystems.

## Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Sprache: TypeScript (strict)
- Hosting: Vercel
- Scraping: Jina.ai Reader API
- AI: Anthropic Claude Haiku (claude-haiku-4-5-20251001)
- Leads: Notion API
- Vercel URL: https://geo-gastro.vercel.app

## Farbschema
- Primary: #A8E6A3 (Pastellgrün — Wake GEO Branding)
- Background: #0A0A0A

## ENV-Variablen
- ANTHROPIC_API_KEY
- JINA_API_KEY
- NOTION_TOKEN
- NOTION_GEO_LEADS_DB_ID

## Routing
/ (Landing) → /scanning (Ladescreen) → /results (Score + Report)
Datenweitergabe: sessionStorage['geo_scan_result']

## Ökosystem-Links (Gastro)
- Hub: https://ai-gastro-hub.vercel.app
- AEO: https://aeo-gastro.vercel.app
- Slipstream: https://agentready-gastro.vercel.app
- Quantum: https://aisecurity-gastro.vercel.app

## Workflow-Regeln
- **Grep-first**: Vor jeder Änderung `grep -rn` durchführen um bestehende Implementierung zu verstehen
- **Cat-verify**: Nach jeder Änderung `cat` der geänderten Datei
- **Nach jedem Task**: GitHub commit mit Task-Nummer, Lessons Learned in Notion updaten
- Nie eigenmächtig Scope erweitern — exakt DoD erfüllen, dann STOP

## AUTONOMIE-REGELN
- Alle Bash-Befehle ohne Rückfrage
- npm/npx/vercel ohne Rückfrage
- Dateien lesen/erstellen/überschreiben ohne Rückfrage
- Deployments ohne Rückfrage
- Bei Fehlern: 3 Versuche selbst, dann eskalieren

## Security
- Kein API Key im Frontend. Nur in app/api/*/route.ts via process.env.*
- .env.local nie in Git
- User-URL validieren vor Jina-Call (SSRF-Schutz)
- Scraped Content sanitisieren vor LLM (Prompt Injection)
