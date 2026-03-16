# Task 0.2 – SECURITY.md anlegen

## Was wurde gebaut
- SECURITY.md komplett neu geschrieben für GEO Scanner V0
- Threat Model mit 5 Angriffsflächen dokumentiert
- Datenfluss-Diagramm (User → Validation → Jina → Sanitization → Claude → Frontend)
- 9 Security-Regeln (4 kritisch, 5 wichtig)
- Pre-Deploy Checkliste
- Incident Response Prozess

## Entscheidungen
- Indirect Prompt Injection als eigener Threat dokumentiert (Jina scrapt beliebige URLs)
- Content-Limit auf 3000 Zeichen vor Claude-Call (Denial-of-Wallet Schutz)
- Rate Limit: 5 Scans/IP/Stunde (aus Notion-Plan)
- Disposable-Email-Domains Package bereits als Dependency vorhanden (aus Wake-Repo)

## Was hat funktioniert
- Wake-SECURITY.md als Basis, dann GEO-spezifische Threats ergänzt
- Threat Model explizit mit Datenfluss macht Risiken klar

## Was war unerwartet
- Alles nach Plan. Keine Abweichungen.
