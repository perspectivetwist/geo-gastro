# BUG.01b: Scan-Button funktioniert nicht auf Gastro-Landingpages

## Problem
Die "Jetzt prüfen" Buttons auf allen 4 Gastro-Scanner Landingpages (geo, aeo, agentready, aisecurity) lösten keinen Scan aus. Button-Klick tat nichts — kein Redirect, kein Error.

## Root Cause
`NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel hatte ein trailing `\n` (Newline). Als Build-Time Variable wird der Wert direkt in den JS-Bundle eingebettet. Das erzeugte:

```js
gtag('config', 'G-7CPW2BNNNC\n')  // ← Newline in Single-Quote String = SyntaxError
```

Die gesamte inline `<Script>` in `GoogleAnalytics.tsx` crashte → `function gtag(){}` wurde nie definiert → `window.gtag` war `undefined`. In `UrlInputForm.tsx` ruft `handleSubmit` `trackScanStart()` auf, welches `window.gtag()` aufruft → TypeError → `router.push('/scanning')` wird nie erreicht.

## Lösung
1. **Vercel ENV fix**: `NEXT_PUBLIC_GA_MEASUREMENT_ID` in allen 4 Repos entfernt und mit `echo -n` (ohne Newline) neu gesetzt
2. **lib/gtag.ts**: `.trim()` auf `GA_MEASUREMENT_ID` hinzugefügt
3. **lib/gtag.ts**: `if (typeof window.gtag !== 'function') return` Null-Check vor jedem `window.gtag()` Call

## Was funktioniert hat
- `agent-browser` für Diagnose: `typeof window.gtag` und CharCode-Analyse im Browser
- Defensive Programming: Null-Check verhindert in Zukunft ähnliche Crashes

## Was vermeiden
- Vercel ENV-Variablen per Copy-Paste setzen (trailing Whitespace/Newlines)
- `NEXT_PUBLIC_` Variablen ohne `.trim()` verwenden — Build-Time-Embedding ist unforgiving
- Externe Tracking-Calls ohne Error-Boundary in kritischen User-Flows

## Nächstes Mal
- Immer `echo -n` beim Setzen von Vercel ENV-Variablen
- Tracking-Calls immer in try-catch oder mit Null-Check wrappen
- Bei "Button tut nichts" sofort Browser-Console prüfen (SyntaxErrors!)
