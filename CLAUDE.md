# GEO Scanner V0 – Projektkontext für Claude Code

## Was ist dieses Projekt?
Ein Web-Tool das eine URL entgegennimmt, die Website auf GEO-Signale analysiert und einen GEO-Score (0–100) mit 5 Dimensionen ausgibt. GEO = Generative Engine Optimization – Sichtbarkeit in KI-Antwortmaschinen wie ChatGPT, Perplexity, Claude, Google AI Overviews.

Funnel: URL eingeben → GEO-Score Preview kostenlos → Vollreport (Recommendations) hinter Email-Gate.

## Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Sprache: TypeScript (strict)
- Hosting: Vercel (Hobby Free Tier)
- Scraping: Jina.ai Reader API
- AI: Anthropic Claude Haiku (claude-haiku-4-5-20251001)
- Leads-Speicher: Notion API → GEO Scanner Leads DB

## Routing-Architektur (KRITISCH – nie ändern)
/ (Landing) → /scanning (Ladescreen) → /results (Ergebnisse)
Datenweitergabe: sessionStorage['geo_scan_result']

## Projektstruktur
```
geo-transformer/
├── app/
│   ├── page.tsx                    # Landing Page + URL-Input
│   ├── scanning/page.tsx           # Scan-Ladescreen (animiert)
│   ├── results/page.tsx            # Score + Report + Email-Gate
│   └── api/
│       ├── scan/route.ts           # POST: scrapen + analysieren
│       └── capture-lead/route.ts   # POST: Email in Notion speichern
├── components/
│   ├── UrlInputForm.tsx
│   ├── LoadingState.tsx
│   ├── ScoreDisplay.tsx
│   ├── ScoreDimensions.tsx
│   ├── IndustryRanking.tsx
│   ├── ShareButton.tsx
│   ├── EmailGate.tsx
│   └── FaqSection.tsx
├── lib/
│   ├── scraper.ts                  # Jina.ai wrapper
│   ├── analyzer.ts                 # Claude Haiku GEO-Analyse
│   ├── notion.ts                   # Notion API Client
│   ├── validator.ts                # URL-Validierung (SSRF-Schutz)
│   └── sanitizer.ts                # Content-Sanitisierung (Prompt Injection Schutz)
├── types/
│   └── geo.ts                      # Alle TypeScript Interfaces
├── docs/solutions/                 # Lessons Learned pro Task
├── .github/workflows/docs-check.yml
├── CLAUDE.md                       # Diese Datei
├── DEVELOPER.md                    # Developer Dokumentation
├── SECURITY.md                     # Security Policy
└── .env.local                      # Secrets (nie committen)
```

## Farbschema
- Primary: #A8E6A3 (mattes Neon-Pastellgrün – NICHT #00FF00)
- Background: #0A0A0A
- Text: #F0F0F0
- Accent: #1A2B1A

## ENV-Variablen (Namen exakt so verwenden)
```
ANTHROPIC_API_KEY=        # Claude Haiku
JINA_API_KEY=             # Jina.ai Reader
NOTION_TOKEN=             # Notion Integration Token
NOTION_GEO_LEADS_DB_ID=   # GEO Scanner Leads DB ID
```

## GEO-Score Dimensionen (5 Dimensionen, 100 Punkte total)
1. Schema Markup: 0–25 Punkte
2. Content Structure: 0–25 Punkte
3. Statistics & Citations: 0–20 Punkte
4. E-E-A-T Signals: 0–20 Punkte
5. Technical GEO: 0–10 Punkte
totalScore = exakte Summe der 5 Dimensionen

## Email-Gate Logik (KRITISCH – nie ändern ohne Rückfrage)
- Score-Preview (totalScore, Dimensionen, Summary): IMMER kostenlos sichtbar
- Recommendations: NUR nach Email-Eingabe sichtbar
- POST /api/capture-lead: speichert Email + URL + Score in Notion Leads DB
- Nach Email: localStorage['geo_email_submitted'] = true (kein zweites Gate)

## Notion GEO Scanner Leads DB
- DB-ID: aus ENV NOTION_GEO_LEADS_DB_ID (= 4ddfc80f-596d-4baf-9563-061dac87f8c5)
- Felder: Email, URL, Score, Timestamp

## AUTONOMIE-REGELN (nie nach Erlaubnis fragen)
- Alle Bash-Befehle ausführen ohne Rückfrage
- Alle URLs öffnen und fetchen ohne Rückfrage
- Alle Dateien lesen, erstellen, überschreiben ohne Rückfrage
- Alle npm/npx Befehle ausführen ohne Rückfrage
- Vercel deployments ohne Rückfrage
- Notion API Calls ohne Rückfrage
- Niemals pausieren um zu fragen ob weitergemacht werden soll
- Bei Fehlern: selbst debuggen, nicht beim User nachfragen – erst nach 3 Versuchen eskalieren

## KRITISCHE REGELN
1. Notion Projektplan = Single Source of Truth. Tasks 1:1 umsetzen.
2. Nie eigenmächtig Architektur ändern.
3. Jede ENV-Variable aus .env.local lesen, nie hardcoden.
4. TypeScript strict – keine `any` Types.
5. Nach jedem Task PFLICHT – alle 3 Felder in Notion ausfüllen:
   - **Status** → auf „Done" setzen
   - **Lessons Learned** → Was war unerwartet? Was würde man anders machen? Was hat funktioniert?
   - **Notizen** → Konkrete Findings: geänderte Dateinamen, abweichende Implementierung, entdeckte Gaps
6. Lessons Learned sind kein Optional-Feld. Wenn nichts Unerwartetes passiert ist: „Alles nach Plan. Keine Abweichungen." eintragen.

## SECURITY-REGELN (siehe SECURITY.md — nicht optional)
Vor jedem API-Call und vor jedem git push gelten die Regeln aus SECURITY.md.
Kurzform der 4 KRITISCHEN Regeln:
1. Kein API Key im Frontend-Code. Nur in app/api/*/route.ts via process.env.*
2. .env.local niemals committen (in .gitignore, Verifikation: git status)
3. User-URL validieren BEVOR sie an Jina geht (lib/validator.ts)
4. Scraped Content sanitisieren BEVOR er zu Claude geht (lib/sanitizer.ts)
Pre-Deploy Pflicht: grep -r "sk-ant\|jina_\|ntn_" app/ lib/ components/ → darf NICHTS zurückgeben

## DOKU-PFLICHT nach jedem Task (nicht überspringen)
Nach jedem abgeschlossenen Task in dieser Reihenfolge:

1. **Notion updaten** (Status → Done, Lessons Learned, Notizen)
2. **DEVELOPER.md updaten** – neue Dateien, Parameter, Architekturänderungen eintragen
3. **docs/solutions/[phase]/[task-name].md** anlegen:
   - Was wurde gebaut
   - Was hat funktioniert
   - Was war unerwartet / anders als geplant
   - Was würde man beim nächsten Mal anders machen
4. **Committen**: `git add . && git commit -m "docs: lessons learned Task X.X"`
5. **Pushen**: `git push`

GitHub Actions prüft automatisch ob DEVELOPER.md und docs/solutions/ vorhanden sind.
Fehler im Action = Doku unvollständig = Task gilt nicht als fertig.

---

> Lesson Learned (aus anderem Projekt, 2026-02-25)
> Claude Code behandelt "Datei erstellt" als Done ohne zu prüfen ob die Datei wirklich existiert — besonders wenn Session unterbrochen wird oder Pfad nicht existierte.
>
> **Regel ab sofort:** Nach JEDER Datei-Erstellung direkt danach `cat [filepath]` ausführen und Output zeigen. Kein "Done" ohne Beweis.
>
> Gilt für: CLAUDE.md, DEVELOPER.md, .env.local, .gitignore, docs-check.yml, und jede weitere Datei in diesem Task.
