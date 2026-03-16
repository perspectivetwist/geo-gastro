# Iteration: 'Gerade aktiv' Badge fixen — simulierte Zahl analog Wake/Slipstream

## Was wurde gebaut
- "Gerade aktiv: X Scans" Badge unter URL-Input in UrlInputForm.tsx
- Simulierte Zahl: Start 3-12, wechselt alle 8-15s um +/-1, min 2 max 15
- Animierter Pulse-Dot in #A8E6A3
- Erscheint unter beiden URL-Inputs (Hero + Footer CTA)

## Entscheidungen
- Badge direkt in UrlInputForm integriert statt eigene Komponente — useState/useEffect braucht 'use client', Form hat das bereits
- Beide URL-Input-Instanzen bekommen den Badge, analog Wake/Slipstream

## Was hat funktioniert
- Logik 1:1 aus Notion-Task übernommen, funktioniert sofort
- useEffect mit setInterval + Cleanup sauber

## Was war unerwartet
- Alles nach Plan. Keine Abweichungen.
