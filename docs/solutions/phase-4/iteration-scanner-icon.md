# Iteration: Scanner-Icon → Netzwerk-Punkte Animation

## Was wurde gebaut
- ScannerIcon (horizontale Scan-Linien) ersetzt durch NetworkIcon (4 verbundene Nodes)
- SVG mit 4 Kreisen + 4 Verbindungslinien + 2 diagonale Hilfslinien
- CSS Keyframes: node-pulse (Nodes pulsieren nacheinander) + line-flicker (Linien subtil flackern)
- Animation-Delay je 0.2s versetzt für sequenzielles Pulsieren

## Entscheidungen
- Reines SVG inline in UrlInputForm.tsx statt separate Komponenten-Datei (zu klein für eigene Datei)
- Keyframes in globals.css statt Tailwind animate (SVG-Attribute wie `r` brauchen echte Keyframes)

## Was hat funktioniert
- SVG-Animation smooth, kein Flackern
- Kein externes Package nötig

## Was war unerwartet
- Nichts, klarer Task
