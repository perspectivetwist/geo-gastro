# Tasks 2.1–2.4 – Scanner-Logik (Phase 2)

## Was wurde gebaut
- **2.1 lib/scraper.ts**: scrapeUrl(url) mit 10s Timeout, Content-Extraktion (Titel, Description, Headings, Schema, FAQ/Author/Date/Links Detection)
- **2.2 lib/analyzer.ts**: analyzeGeo(scraped) mit Claude Haiku, 5 GEO-Dimensionen, Prompt Injection Sanitisierung, 3000 Zeichen Content-Limit
- **2.3 app/api/scan/route.ts**: POST /api/scan mit URL-Validation, SSRF-Schutz (13 Blocked-Host-Patterns), Pipeline scrape→analyze
- **2.4 lib/rate-limit.ts**: 5 Scans/IP/Stunde, In-Memory Map (aus Wake-Repo übernommen)

## Entscheidungen
- Content-Sanitisierung inline in analyzer.ts statt separatem lib/sanitizer.ts (KISS für V0)
- API gibt vollständige Analyse zurück (inkl. Recommendations) — Email-Gate client-side
- Nur HTTPS erlaubt (kein HTTP) — strenger als Wake-Repo
- JSON-Extraktion per Regex für Robustheit gegen Markdown-Codeblocks
- Dimensionen werden geclampt auf gültige Ranges (0-25, 0-25, 0-20, 0-20, 0-10)

## Was hat funktioniert
- Wake-Repo Rate-Limit passte 1:1
- Build auf Anhieb erfolgreich nach allen 4 Tasks

## Was war unerwartet
- Sanitisierung als separates lib/sanitizer.ts wäre Over-Engineering — inline reicht für V0
