# GEO Scanner V0 – Security Policy

## Threat Model

### Angriffsflächen
1. **User-URL-Input** → wird an Jina.ai weitergeleitet (SSRF-Risiko)
2. **Jina.ai Scraping-Output** → wird an Claude Haiku gesendet (Indirect Prompt Injection)
3. **Claude Haiku Output** → wird im Frontend angezeigt (XSS-Risiko)
4. **Email-Input** → wird in Notion gespeichert (Injection-Risiko)
5. **API-Kosten** → unkontrollierte Nutzung (Denial of Wallet)

### Datenfluss
```
User-URL → [Validation] → Jina.ai → [Sanitization] → Claude Haiku → [Validation] → Frontend
User-Email → [Validation] → Notion API
```

## KRITISCHE REGELN (Verstoß = sofort fixen)

### 1. Kein API Key im Frontend
- API Keys NUR in `app/api/*/route.ts` via `process.env.*`
- Niemals in Components, lib/-Dateien die client-side laufen, oder hardcoded
- Pre-Deploy Check: `grep -r "sk-ant\|jina_\|ntn_" app/ lib/ components/` → muss leer sein

### 2. .env.local nie committen
- `.env.local` steht in `.gitignore`
- Verifikation vor jedem Push: `git status` → `.env.local` darf NICHT auftauchen
- API Keys nur über Vercel Environment Variables oder lokale .env.local

### 3. User-Input validieren (SSRF-Schutz)
- User-URL validieren BEVOR sie an Jina.ai geht
- Nur HTTPS erlauben (kein HTTP, file://, ftp://, data://)
- Private IPs blocken (127.0.0.1, 10.x, 192.168.x, 172.16-31.x, ::1, fc00::)
- Max URL-Länge: 2048 Zeichen
- Implementierung: `lib/validator.ts`

### 4. Scraped Content sanitisieren (Indirect Prompt Injection Schutz)
- Content von Jina.ai sanitisieren BEVOR er an Claude Haiku geht
- **Spezifisches Risiko:** Jina.ai scrapt beliebige externe URLs — Angreifer können Prompt-Injection-Payloads in ihren Website-Content einbauen
- Bekannte Injection-Patterns entfernen (system prompts, role overrides)
- Content auf **3000 Zeichen kürzen** vor Claude-Call (Denial-of-Wallet Schutz)
- Implementierung: `lib/sanitizer.ts`
- Referenz: OWASP LLM01 (Indirect Prompt Injection)

## WICHTIGE REGELN

### 5. Rate Limiting (Denial of Wallet – OWASP LLM10)
- **Max. 5 Scans pro IP pro Stunde** via Vercel Middleware
- Bei Überschreitung: 429 Too Many Requests + verständliche Fehlermeldung
- Max. Token-Limit pro Claude-Request: 2000 Input-Tokens
- Implementierung: `middleware.ts`

### 6. LLM Output validieren
- Claude Haiku Output validieren bevor er im Frontend angezeigt wird
- JSON-Schema Validierung auf Analyse-Output
- XSS-Schutz: kein rohes HTML aus LLM-Output rendern (OWASP LLM02)

### 7. Least Privilege
- Jeder API Token nur mit minimalem Zugriff
- Notion Token: nur Zugriff auf GEO Scanner Leads DB
- Jina.ai: nur Reader API
- Claude: nur Haiku, kein Tool-Use

### 8. Error Handling
- Keine Stack Traces an User zurückgeben
- Generische Fehlermeldungen im Frontend
- Detailliertes Logging nur server-side (console.error)

### 9. Email-Validierung
- Email-Format prüfen (Regex + Grundvalidierung)
- Keine Disposable-Email-Domains akzeptieren (disposable-email-domains Package)
- Max Email-Länge: 254 Zeichen

## Pre-Deploy Checkliste

```bash
# 1. Keine API Keys im Code
grep -r "sk-ant\|jina_\|ntn_" app/ lib/ components/
# → Muss leer sein

# 2. .env.local nicht in Git
git status | grep ".env"
# → .env.local darf NICHT gelistet sein

# 3. .gitignore korrekt
cat .gitignore | grep "env"
# → .env* muss enthalten sein

# 4. Keine hardcoded URLs zu internen Services
grep -r "localhost\|127\.0\.0\.1" app/ lib/ --include="*.ts" --include="*.tsx" | grep -v "node_modules"
# → Nur in dev-Konfiguration erlaubt
```

## Incident Response
Bei Verdacht auf API-Key-Leak:
1. Sofort Key rotieren (Anthropic Console, Jina Dashboard, Notion Settings)
2. Vercel Environment Variables updaten
3. Git History prüfen: `git log --all --full-history -- .env*`
