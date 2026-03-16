# Task 1.1 – Next.js Projekt aufsetzen + Vercel Deployment

## Was wurde gebaut
- Kompletter Umbau von AEO-Transformer auf GEO Scanner V0
- Farbschema: #A8E6A3 (Primary), #0A0A0A (BG), #F0F0F0 (Text), #1A2B1A (Accent)
- Landing Page mit GEO Scanner Branding, FAQ, Feature Grid
- /scanning Page mit grünem Ladescreen
- /results Page (Placeholder für Phase 3)
- API Routes: /api/scan (Placeholder), /api/capture-lead
- Vercel deployed: geo-transformer.vercel.app

## Entscheidungen
- 13 alte AEO-Components gelöscht statt umgebaut (sauberer Neustart)
- types/geo.ts als Minimal-Stub erstellt (wird in 1.3 vervollständigt)
- Results Page zeigt nur Redirect-to-home wenn keine sessionStorage-Daten
- CTA-Button nutzt custom cta-glow Klasse statt Tailwind-Gradient

## Was hat funktioniert
- Clone-Ansatz + Clean-Rewrite spart Zeit vs. Component-für-Component Umbau
- Build auf Anhieb erfolgreich nach Umbau
- Vercel Link + Deploy in einem Schritt

## Was war unerwartet
- Viele alte Components hatten imports von gelöschten Dateien — musste alles auf einmal umbauen
- package-lock.json hat sich auch geändert (npm install nach Umbau)
