# GEO Scanner V0 – Developer Documentation

## Was ist das?
Web-App: URL eingeben → GEO-Score (0–100) mit 5 Dimensionen + ActionPlan hinter Email-Gate (ab Scan 2).
Stack: Next.js 14 (App Router) + Tailwind + TypeScript + Vercel.

## Dateistruktur
```
geo-transformer/
├── app/
│   ├── page.tsx                    # Landing Page + URL-Input
│   ├── scanning/page.tsx           # Scan-Ladescreen (animiert, 6 Steps)
│   ├── results/page.tsx            # Score + Report + Email-Gate
│   ├── layout.tsx                  # Root Layout + Metadata
│   ├── globals.css                 # Tailwind + Custom Styles (Pastellgrün)
│   ├── icon.tsx                    # Dynamic Favicon (grün, "G")
│   ├── opengraph-image.tsx         # OG-Image (statisch generiert)
│   ├── impressum/page.tsx          # Impressum
│   ├── datenschutz/page.tsx        # Datenschutz
│   └── api/
│       ├── scan/route.ts           # POST: scrapen + analysieren
│       └── capture-lead/route.ts   # POST: Email in Notion speichern
├── components/
│   ├── UrlInputForm.tsx            # URL-Input mit Netzwerk-Animation
│   ├── ScoreDisplay.tsx            # SVG-Ring mit Score + Band-Label
│   ├── ScoreDimensions.tsx         # 5 Balken mit KMU-Labels
│   ├── IndustryRanking.tsx         # Simuliertes Branchen-Ranking
│   ├── ShareButton.tsx             # Clipboard Copy
│   ├── ActionPlan.tsx              # Per-Dimension Aktionsplan (Post-Gate)
│   ├── EmailGate.tsx               # Fixed-Bottom Email Modal + Lead-Capture
│   ├── Recommendations.tsx         # Found/Missing/Empfehlungen (Legacy)
│   ├── FaqSection.tsx              # Results-FAQ (nicht mehr verwendet)
│   ├── LandingFaq.tsx              # Landing-FAQ (GEO vs. SEO Abgrenzung)
│   └── Footer.tsx                  # Footer mit Impressum/Datenschutz Links
├── lib/
│   ├── scraper.ts                  # Jina.ai wrapper (10s Timeout)
│   ├── analyzer.ts                 # Claude Haiku GEO-Analyse (5 Dimensionen + ActionPlan)
│   ├── notion.ts                   # Notion API Client (saveGeoLead)
│   ├── rate-limit.ts               # In-Memory Rate Limit (5/IP/h)
│   └── score-labels.ts             # Score-Bands + Dimension-Labels (KMU-Sprache)
├── types/
│   └── geo.ts                      # TypeScript Interfaces (7 Interfaces inkl. ActionPlan)
├── docs/solutions/                 # Lessons Learned pro Task
├── .github/workflows/docs-check.yml
├── CLAUDE.md                       # Claude Code Kontext
├── DEVELOPER.md                    # Diese Datei
├── SECURITY.md                     # Security Policy + Threat Model
└── .env.local                      # Secrets (nie committen!)
```

## Routing
/ (Landing) → /scanning (Ladescreen) → /results (Ergebnisse)
Datenweitergabe: sessionStorage['geo_scan_result']

## Farbschema
- Primary: #A8E6A3 (mattes Neon-Pastellgrün)
- Background: #0A0A0A
- Text: #F0F0F0
- Accent: #1A2B1A

## Lokale Entwicklung
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deployment
```bash
npx vercel --prod
# → https://geo-transformer.vercel.app
```

## ENV-Variablen
```
ANTHROPIC_API_KEY         – Claude Haiku (GEO-Analyse)
JINA_API_KEY              – Jina.ai Reader (Scraping)
NOTION_TOKEN              – Notion Integration
NOTION_GEO_LEADS_DB_ID   – GEO Scanner Leads DB (4ddfc80f-596d-4baf-9563-061dac87f8c5)
```

## Architektur
```
Landing → /scanning → API Call → sessionStorage → /results
API: URL → Validation → Jina.ai (Scrape) → Sanitize → Claude Haiku (Analyze) → JSON
```

## GEO-Score Dimensionen
1. Schema Markup: 0–25 (Maschinenlesbarkeit)
2. Content Structure: 0–25 (Inhaltsstruktur)
3. Statistics & Citations: 0–20 (Fakten & Quellen)
4. E-E-A-T Signals: 0–20 (Vertrauenswürdigkeit)
5. Technical GEO: 0–10 (Technische Basis)
Total = exakte Summe = 0–100

## Email-Gate Logik (Slipstream-Pattern)
- Score-Preview: IMMER sichtbar (Score, Dimensionen, Ranking)
- Scan 1: ActionPlan direkt sichtbar (kein Gate)
- Scan 2+: EmailGate (fixed-bottom Modal), ActionPlan als geblurrter Teaser
- Nach Email: localStorage['geo_email_submitted'] = true → kein Gate mehr
- Scan-Count: localStorage['geo_scans'] (incrementiert bei jedem Scan)

## Bekannte Limitierungen
- localStorage Gate: kein echter Schutz, nur UX-Gate für V0
- Vercel Hobby: max. 60 Sek. Function Runtime
- Rate Limiting: In-Memory (Reset bei Redeploy)
- Branchen-Ranking: simuliert (keine echte Vergleichs-DB)

## Nach jedem Task aktualisieren
Wenn neue Parameter, Dateien oder Architekturänderungen entstehen → dieses File updaten.
Lessons Learned → docs/solutions/[phase]/[task].md
