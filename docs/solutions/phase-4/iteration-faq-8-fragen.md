# Iteration: FAQ ausbauen — 8 Fragen KMU-Perspektive

## Was wurde gebaut
- FAQ von 5 auf 8 Fragen erweitert in `components/LandingFaq.tsx`
- Reihenfolge: Problem → Lösung → Vertrauen → Conversion
- Kein Tech-Jargon (kein "Schema Markup", kein "E-E-A-T")
- Erste Frage alwaysOpen mit Trust-Badges beibehalten

## Entscheidungen
- Trust-Badges (DSGVO, 20 Sek, Made in Germany) unter erster Frage bleiben — passt zum Problem-Einstieg "Verliere ich wirklich Kunden?"
- Keine strukturelle Änderung an der Komponente nötig — nur faqItems Array erweitert

## Was hat funktioniert
- Texte 1:1 aus Notion-Task übernommen, kein Umschreiben nötig
- Bestehende Accordion-Komponente skaliert problemlos auf 8 Items

## Was war unerwartet
- Alles nach Plan. Keine Abweichungen.
