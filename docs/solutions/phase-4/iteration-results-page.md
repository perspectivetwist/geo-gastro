# Iteration: Results Page 1:1 analog Slipstream rebuilden

## Was wurde gebaut
- Results Page komplett auf Slipstream-Pattern umgebaut
- ActionPlan-Komponente: pro Dimension mit Status-Badge, topFix, Steps, businessImpact
- Email-Gate: fixed-bottom Modal (statt inline Block)
- Gate-Logik: Scan 1 frei, ab Scan 2 Gate (localStorage['geo_scans'])
- Teaser: geblurrte ActionPlan-Vorschau wenn Gate aktiv
- Zusammenfassungs-Fließtext entfernt
- FAQ auf Results Page entfernt

## Entscheidungen
- ActionPlan als eigene Datenstruktur in types/geo.ts (DimensionAction + GeoActionPlan)
- Claude Haiku Prompt erweitert: liefert jetzt 5 actionPlan-Einträge (einer pro Dimension)
- max_tokens von 1024 auf 2048 erhöht (actionPlan braucht mehr Output)
- Status-Mapping: unter 40% = kritisch, 40-70% = verbesserung, über 70% = gut

## Was hat funktioniert
- Claude Haiku liefert zuverlässig 5 actionPlan-Einträge im korrekten Format
- Slipstream-Pattern lässt sich sauber adaptieren (Struktur identisch, Farbe + Texte angepasst)

## Was war unerwartet
- max_tokens 1024 reichte nicht für actionPlan — API gab "KI-Analyse fehlgeschlagen"
- Fix: auf 2048 erhöht, danach funktionierte es sofort
