<div align="center">

# QR Studio

**Schöner QR-Code-Generator mit abgerundeten Modulen, eigenem Logo in der Mitte und vielen Inhaltstypen — komplett im Browser, ohne dass deine Daten den Rechner verlassen.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Built with Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Live](https://img.shields.io/badge/Live-hasenkamp.app-d4ff3f)](https://hasenkamp.app)

[Live-Demo](https://hasenkamp.app) · [Features](#features) · [Schnellstart](#schnellstart) · [Deployment](#deployment) · [Mitwirken](#mitwirken)

</div>

---

## Features

- 🎨 **Abgerundete Module & Ecken** – mehrere Stile (rund, extra rund, Punkte, classy …)
- 🖼️ **Logo in der Mitte** – Bild hochladen, Größe und Rand frei einstellbar
- 🔒 **Sicherer SVG-Upload** – hochgeladene SVGs werden mit DOMPurify gesäubert (XSS-Schutz)
- 🧩 **8 Inhaltstypen** – Link, Text, WLAN, E-Mail, Telefon, SMS, Kontakt (vCard), Standort
- 🌈 **Eigene Farben** – Punkt- und Hintergrundfarbe mit Presets
- ⚡ **Dynamische Fehlerkorrektur** – `H` mit Logo, `M` ohne (besser scanbar)
- 💾 **Export** – PNG, SVG und JPG
- 🔐 **Datenschutzfreundlich** – alles läuft clientseitig, lokal gehostete Schriften (keine Google-Fonts-CDN), keine Cookies, kein Tracking
- 📱 **Responsive** mit Live-Vorschau

## Inhaltstypen

| Typ | Felder | Erzeugtes Format |
|-----|--------|------------------|
| Link | URL | direkte URL |
| Text | Freitext | reiner Text |
| WLAN | SSID, Verschlüsselung, Passwort, versteckt | `WIFI:T:…;S:…;P:…;;` |
| E-Mail | Adresse, Betreff, Nachricht | `mailto:…` |
| Telefon | Nummer | `tel:…` |
| SMS | Nummer, Nachricht | `SMSTO:…` |
| Kontakt | Name, Firma, Position, Tel, E-Mail, Web | vCard 3.0 |
| Standort | Breiten-/Längengrad | `geo:lat,lng` |

## Tech-Stack

- **[React 18](https://react.dev) + [Vite](https://vitejs.dev)** – Frontend & Build
- **[qr-code-styling](https://github.com/kozakdenys/qr-code-styling)** – anpassbare QR-Codes, Logo nativ
- **[DOMPurify](https://github.com/cure53/DOMPurify)** – Sanitizing hochgeladener SVGs
- **[lucide-react](https://lucide.dev)** – Icons
- **[Fontsource](https://fontsource.org)** – lokal gehostete Schriften (Fraunces, Plus Jakarta Sans, Space Mono)

## Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org) 18 oder neuer
- npm (kommt mit Node.js)

### Installation

```bash
git clone https://github.com/hasenkamp-solutions/qr-studio.git
cd qr-studio
npm install
npm run dev
```

Die App läuft danach auf <http://localhost:5173>.

### Skripte

| Befehl | Beschreibung |
|--------|--------------|
| `npm run dev` | Dev-Server mit Hot-Reload |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm run preview` | gebauten Build lokal testen |

## Projektstruktur

```
qr-studio/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Hauptkomponente: UI, State, QR-Logik
│   ├── Legal.jsx        # Impressum & Datenschutz (Modals)
│   ├── main.jsx         # Einstiegspunkt, Font-Imports
│   └── styles.css       # komplettes Design
├── index.html
├── standalone.html      # einfache No-Build-Variante (nur CDN)
├── wrangler.jsonc       # Cloudflare-Deploy-Konfiguration
└── vite.config.js
```

## Deployment

Die App ist eine statische Single-Page-App und läuft auf **Cloudflare** (Workers Static Assets).

### Per Git (empfohlen, Auto-Deploy bei jedem Push)

1. Repo zu GitHub pushen.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → Repository verbinden.
3. Build-Einstellungen:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. **Deploy** – `wrangler.jsonc` liefert das gebaute `dist/` als statische Assets aus, inkl. SPA-Fallback (`not_found_handling: "single-page-application"`).

### Manuell via Wrangler

```bash
npm run build
npx wrangler deploy
```

### Eigene Domain

Projekt → **Settings → Domains & Routes → Add → Custom Domain**. Liegt die
DNS-Zone bei Cloudflare, werden DNS-Eintrag und TLS-Zertifikat automatisch
angelegt. DDoS-Schutz ist für proxied Traffic automatisch aktiv.

## Datenschutz

QR Studio verarbeitet alle Eingaben (Inhalte, Farben, hochgeladene Logos)
**ausschließlich lokal im Browser**. Es werden keine Inhalte an einen Server
übertragen oder gespeichert. Schriften werden lokal ausgeliefert (keine
Google-Fonts-CDN). Impressum und Datenschutz sind in der App über den Footer
erreichbar ([src/Legal.jsx](src/Legal.jsx)).

## Mitwirken

Beiträge sind willkommen! So gehst du vor:

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/meine-idee`)
3. Änderungen committen (`git commit -m "feat: meine Idee"`)
4. Branch pushen (`git push origin feature/meine-idee`)
5. Pull Request öffnen

Bitte stelle sicher, dass `npm run build` fehlerfrei durchläuft, bevor du den
PR öffnest. Für größere Änderungen vorab gern ein Issue zur Abstimmung.

## Lizenz

Quellcode unter der **[MIT-Lizenz](LICENSE)** – frei nutzbar, anpassbar und
einbaubar (auch kommerziell), unter Beibehaltung des Copyright-Hinweises.

Die mitgelieferten Schriftarten (Fraunces, Plus Jakarta Sans, Space Mono)
stehen unter der **SIL Open Font License (OFL)** und sind davon unberührt.

---

<div align="center">

Ein kostenloser Service von [hasenkamp solutions](https://hkp-solutions.de) &amp; [hasenkamp.dev](https://hasenkamp.dev)

</div>
