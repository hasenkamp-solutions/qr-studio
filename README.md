# QR Studio

QR-Code-Generator mit abgerundeten Modulen, eigenem Logo in der Mitte und
mehreren Inhaltstypen (Link, Text, WLAN, E-Mail, Telefon, SMS, vCard, Standort).

Ein Service von hasenkamp solutions & hasenkamp development.

## Tech-Stack

- **React 18 + Vite** – Frontend & Build
- **qr-code-styling** – anpassbare QR-Codes (Logo nativ in der Mitte)
- **DOMPurify** – Säubern hochgeladener SVG-Logos (XSS-Schutz)
- **lucide-react** – Icons
- **Fontsource** – lokal gehostete Schriften (Fraunces, Plus Jakarta Sans, Space Mono), keine Google-Fonts-CDN

## Lokale Entwicklung

```bash
npm install
npm run dev      # Dev-Server (http://localhost:5173)
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal testen
```

## Deployment auf Cloudflare Pages

Ziel-Domain: **hasenkamp.app** (Root-Domain)

### Variante A – via GitHub (empfohlen, Auto-Deploy bei jedem Push)

1. Repo zu GitHub pushen.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Repository auswählen und folgende Build-Einstellungen setzen:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Save and Deploy** – die App ist danach unter `<projekt>.pages.dev` erreichbar.

### Variante B – direkter Upload via Wrangler

```bash
npm run build
npx wrangler pages deploy dist
```

### Root-Domain verbinden

1. Pages-Projekt → **Custom domains** → **Set up a custom domain**.
2. `hasenkamp.app` eingeben. Da die DNS-Zone bei Cloudflare liegt, wird der
   passende DNS-Eintrag (CNAME-Flattening für die Apex-Domain) automatisch
   angelegt und das TLS-Zertifikat ausgestellt.
3. Optional `www.hasenkamp.app` ebenfalls hinzufügen und per Redirect-Rule auf
   die Apex-Domain weiterleiten.

`public/_redirects` sorgt dafür, dass alle Pfade auf `index.html` zeigen
(SPA-Fallback).

## Rechtliches

Impressum und Datenschutz sind in der App über den Footer erreichbar
([src/Legal.jsx](src/Legal.jsx)).

> **Vor dem Livegang prüfen:** Im Datenschutz (Abschnitt 3) ist der
> Hosting-Anbieter einzutragen — für Cloudflare Pages:
> **Cloudflare, Inc.**, 101 Townsend St, San Francisco, CA 94107, USA.
