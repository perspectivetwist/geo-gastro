# Task 1.2 – Notion Leads DB + API-Verbindung testen

## Was wurde gebaut
- lib/notion.ts: saveGeoLead() schreibt in Notion GEO Scanner Leads DB
- .env.local erstellt mit NOTION_GEO_LEADS_DB_ID
- Test-Eintrag erfolgreich in DB geschrieben

## Entscheidungen
- URL-Feld ist rich_text (nicht url-Typ) — Notion API erwartet rich_text Array
- Timestamp nicht explizit setzen — createdTime wird automatisch gesetzt
- GEO_Details Spalte existiert für späteren Vollreport-Content

## Was hat funktioniert
- DB existierte bereits mit korrektem Schema
- Test-Eintrag auf Anhieb erfolgreich

## Was war unerwartet
- Timestamp-Property hat expanded-Format-Namen (date:Timestamp:start) — verwirrend, aber createdTime reicht für V0
