import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import DOMPurify from "dompurify";
import { Impressum, Datenschutz, LegalModal } from "./Legal.jsx";
import {
  Link2,
  ImagePlus,
  Trash2,
  Grid2x2,
  ScanLine,
  Palette,
  Maximize2,
  Frame,
  Download,
  FileImage,
  FileCode2,
  Sparkles,
  AlertTriangle,
  Type,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Contact,
  RotateCcw,
} from "lucide-react";

const DOT_STYLES = [
  { value: "extra-rounded", label: "Extra rund" },
  { value: "rounded", label: "Rund" },
  { value: "dots", label: "Punkte" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy rund" },
  { value: "square", label: "Eckig" },
];

const CORNER_STYLES = [
  { value: "extra-rounded", label: "Rund" },
  { value: "dot", label: "Punkt" },
  { value: "square", label: "Eckig" },
];

const COLOR_PRESETS = [
  "#15140f",
  "#1d4ed8",
  "#b91c1c",
  "#047857",
  "#7c3aed",
  "#ea580c",
];

const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB

// Standardwerte (für Initialzustand und Zurücksetzen)
const DEFAULTS = {
  contentType: "url",
  form: { url: "https://example.com", encryption: "WPA" },
  dotsType: "extra-rounded",
  cornerType: "extra-rounded",
  dotsColor: "#15140f",
  bgColor: "#ffffff",
  imageSize: 0.4,
  imageMargin: 8,
};

// Verfügbare Inhaltstypen für den QR-Code
const CONTENT_TYPES = [
  { key: "url", label: "Link", icon: Link2 },
  { key: "text", label: "Text", icon: Type },
  { key: "wifi", label: "WLAN", icon: Wifi },
  { key: "email", label: "E-Mail", icon: Mail },
  { key: "phone", label: "Telefon", icon: Phone },
  { key: "sms", label: "SMS", icon: MessageSquare },
  { key: "vcard", label: "Kontakt", icon: Contact },
  { key: "geo", label: "Standort", icon: MapPin },
];

// Sonderzeichen für das WLAN-Format escapen
const escWifi = (s = "") => s.replace(/([\\;,:"])/g, "\\$1");

// Erzeugt aus den Formularfeldern den passenden QR-String je Typ
function buildData(type, f) {
  switch (type) {
    case "url":
      return f.url || "";
    case "text":
      return f.text || "";
    case "wifi": {
      if (!f.ssid) return "";
      const auth = f.encryption || "WPA";
      const parts = [`WIFI:T:${auth}`, `S:${escWifi(f.ssid)}`];
      if (auth !== "nopass") parts.push(`P:${escWifi(f.password || "")}`);
      if (f.hidden) parts.push("H:true");
      return parts.join(";") + ";;";
    }
    case "email": {
      if (!f.email) return "";
      const q = [];
      if (f.subject) q.push("subject=" + encodeURIComponent(f.subject));
      if (f.body) q.push("body=" + encodeURIComponent(f.body));
      return `mailto:${f.email}${q.length ? "?" + q.join("&") : ""}`;
    }
    case "phone":
      return f.phone ? `tel:${f.phone}` : "";
    case "sms":
      return f.smsNumber ? `SMSTO:${f.smsNumber}:${f.smsBody || ""}` : "";
    case "geo":
      return f.lat && f.lng ? `geo:${f.lat},${f.lng}` : "";
    case "vcard": {
      if (!f.firstName && !f.lastName) return "";
      const full = `${f.firstName || ""} ${f.lastName || ""}`.trim();
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${f.lastName || ""};${f.firstName || ""}`,
        `FN:${full}`,
        f.org && `ORG:${f.org}`,
        f.jobTitle && `TITLE:${f.jobTitle}`,
        f.vphone && `TEL:${f.vphone}`,
        f.vemail && `EMAIL:${f.vemail}`,
        f.vurl && `URL:${f.vurl}`,
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }
    default:
      return "";
  }
}

// Prüft und säubert ein SVG mit DOMPurify. Gibt bereinigtes SVG zurück
// oder einen Fehler, falls die Datei kein gültiges SVG ist.
function validateSvg(text) {
  // 1. Muss überhaupt gültiges XML mit <svg>-Wurzel sein
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  if (doc.querySelector("parsererror")) {
    return { ok: false, error: "Ungültiges SVG — kein gültiges XML." };
  }
  if (doc.documentElement?.nodeName.toLowerCase() !== "svg") {
    return { ok: false, error: "Die Datei ist kein SVG." };
  }

  // 2. Mit DOMPurify säubern: entfernt <script>, Event-Handler,
  //    javascript:-URLs, externe Referenzen etc. und gibt sauberes SVG zurück
  const clean = DOMPurify.sanitize(text, {
    USE_PROFILES: { svg: true, svgFilters: true },
  });

  // 3. Nach dem Säubern muss noch ein <svg>-Element übrig sein
  if (!clean || !/<svg[\s>]/i.test(clean)) {
    return { ok: false, error: "SVG konnte nicht sicher verarbeitet werden." };
  }

  return { ok: true, svg: clean };
}

export default function App() {
  const [contentType, setContentType] = useState(DEFAULTS.contentType);
  const [form, setForm] = useState(DEFAULTS.form);
  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const data = useMemo(() => buildData(contentType, form), [contentType, form]);
  const [logo, setLogo] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoError, setLogoError] = useState("");
  const [dotsType, setDotsType] = useState(DEFAULTS.dotsType);
  const [cornerType, setCornerType] = useState(DEFAULTS.cornerType);
  const [dotsColor, setDotsColor] = useState(DEFAULTS.dotsColor);
  const [bgColor, setBgColor] = useState(DEFAULTS.bgColor);
  const [imageSize, setImageSize] = useState(DEFAULTS.imageSize);
  const [imageMargin, setImageMargin] = useState(DEFAULTS.imageMargin);
  const [legalModal, setLegalModal] = useState(null); // "impressum" | "datenschutz" | null

  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  const options = useMemo(
    () => ({
      width: 340,
      height: 340,
      type: "svg",
      data: data || " ",
      image: logo || undefined,
      qrOptions: { errorCorrectionLevel: "H" },
      dotsOptions: { color: dotsColor, type: dotsType },
      cornersSquareOptions: { type: cornerType, color: dotsColor },
      cornersDotOptions: { type: "dot", color: dotsColor },
      backgroundOptions: { color: bgColor },
      imageOptions: {
        crossOrigin: "anonymous",
        imageSize: Number(imageSize),
        margin: Number(imageMargin),
        hideBackgroundDots: true,
      },
    }),
    [data, logo, dotsType, cornerType, dotsColor, bgColor, imageSize, imageMargin]
  );

  const qrCode = useMemo(() => new QRCodeStyling(options), []);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = "";
      qrCode.append(previewRef.current);
    }
  }, [qrCode]);

  useEffect(() => {
    qrCode.update(options);
  }, [options, qrCode]);

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError("");

    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Datei ist zu groß (max. 1 MB).");
      resetInput();
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const looksSvg = file.type === "image/svg+xml" || ext === "svg";

    if (looksSvg) {
      // SVG: Inhalt lesen und als echtes, ungefährliches SVG validieren
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = validateSvg(String(ev.target.result));
        if (!result.ok) {
          setLogoError(result.error);
          resetInput();
          return;
        }
        const dataUrl =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(result.svg);
        setLogo(dataUrl);
        setLogoName(file.name);
      };
      reader.onerror = () => setLogoError("Datei konnte nicht gelesen werden.");
      reader.readAsText(file);
    } else {
      // Raster: validieren, dass es sich wirklich als Bild dekodieren lässt
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = String(ev.target.result);
        const img = new Image();
        img.onload = () => {
          setLogo(dataUrl);
          setLogoName(file.name);
        };
        img.onerror = () => {
          setLogoError("Die Datei ist kein gültiges Bild.");
          resetInput();
        };
        img.src = dataUrl;
      };
      reader.onerror = () => setLogoError("Datei konnte nicht gelesen werden.");
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo("");
    setLogoName("");
    setLogoError("");
    resetInput();
  };

  // Setzt nur die Stilanpassungen zurück (nicht Inhalt oder Logo)
  const handleResetStyle = () => {
    setDotsType(DEFAULTS.dotsType);
    setCornerType(DEFAULTS.cornerType);
    setDotsColor(DEFAULTS.dotsColor);
    setBgColor(DEFAULTS.bgColor);
    setImageSize(DEFAULTS.imageSize);
    setImageMargin(DEFAULTS.imageMargin);
  };

  const download = (extension) => qrCode.download({ name: "qr-code", extension });

  const active = CONTENT_TYPES.find((t) => t.key === contentType);

  const renderFields = () => {
    switch (contentType) {
      case "url":
        return (
          <input
            className="text-input"
            type="url"
            value={form.url || ""}
            onChange={(e) => setField("url", e.target.value)}
            placeholder="https://example.com"
          />
        );
      case "text":
        return (
          <textarea
            className="text-input area"
            rows={3}
            value={form.text || ""}
            onChange={(e) => setField("text", e.target.value)}
            placeholder="Beliebiger Text …"
          />
        );
      case "wifi":
        return (
          <div className="stack">
            <input
              className="text-input"
              value={form.ssid || ""}
              onChange={(e) => setField("ssid", e.target.value)}
              placeholder="Netzwerkname (SSID)"
            />
            <select
              className="text-input"
              value={form.encryption || "WPA"}
              onChange={(e) => setField("encryption", e.target.value)}
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Kein Passwort</option>
            </select>
            {form.encryption !== "nopass" && (
              <input
                className="text-input"
                value={form.password || ""}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Passwort"
              />
            )}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={!!form.hidden}
                onChange={(e) => setField("hidden", e.target.checked)}
              />
              Verstecktes Netzwerk
            </label>
          </div>
        );
      case "email":
        return (
          <div className="stack">
            <input
              className="text-input"
              type="email"
              value={form.email || ""}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="empfaenger@mail.de"
            />
            <input
              className="text-input"
              value={form.subject || ""}
              onChange={(e) => setField("subject", e.target.value)}
              placeholder="Betreff (optional)"
            />
            <textarea
              className="text-input area"
              rows={2}
              value={form.body || ""}
              onChange={(e) => setField("body", e.target.value)}
              placeholder="Nachricht (optional)"
            />
          </div>
        );
      case "phone":
        return (
          <input
            className="text-input"
            type="tel"
            value={form.phone || ""}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+49 170 1234567"
          />
        );
      case "sms":
        return (
          <div className="stack">
            <input
              className="text-input"
              type="tel"
              value={form.smsNumber || ""}
              onChange={(e) => setField("smsNumber", e.target.value)}
              placeholder="+49 170 1234567"
            />
            <textarea
              className="text-input area"
              rows={2}
              value={form.smsBody || ""}
              onChange={(e) => setField("smsBody", e.target.value)}
              placeholder="Nachricht (optional)"
            />
          </div>
        );
      case "geo":
        return (
          <div className="duo">
            <input
              className="text-input"
              value={form.lat || ""}
              onChange={(e) => setField("lat", e.target.value)}
              placeholder="Breitengrad"
            />
            <input
              className="text-input"
              value={form.lng || ""}
              onChange={(e) => setField("lng", e.target.value)}
              placeholder="Längengrad"
            />
          </div>
        );
      case "vcard":
        return (
          <div className="stack">
            <div className="duo">
              <input
                className="text-input"
                value={form.firstName || ""}
                onChange={(e) => setField("firstName", e.target.value)}
                placeholder="Vorname"
              />
              <input
                className="text-input"
                value={form.lastName || ""}
                onChange={(e) => setField("lastName", e.target.value)}
                placeholder="Nachname"
              />
            </div>
            <input
              className="text-input"
              value={form.org || ""}
              onChange={(e) => setField("org", e.target.value)}
              placeholder="Firma (optional)"
            />
            <input
              className="text-input"
              value={form.jobTitle || ""}
              onChange={(e) => setField("jobTitle", e.target.value)}
              placeholder="Position (optional)"
            />
            <input
              className="text-input"
              type="tel"
              value={form.vphone || ""}
              onChange={(e) => setField("vphone", e.target.value)}
              placeholder="Telefon (optional)"
            />
            <input
              className="text-input"
              type="email"
              value={form.vemail || ""}
              onChange={(e) => setField("vemail", e.target.value)}
              placeholder="E-Mail (optional)"
            />
            <input
              className="text-input"
              type="url"
              value={form.vurl || ""}
              onChange={(e) => setField("vurl", e.target.value)}
              placeholder="Webseite (optional)"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page">
      <div className="ambient" aria-hidden />

      <header className="masthead">
        <div className="brand">
          <span className="brand-mark">
            <ScanLine size={18} strokeWidth={2.4} />
          </span>
          <span className="brand-name">QR Studio</span>
        </div>
        <span className="brand-tag">
          <Sparkles size={13} /> abgerundet &amp; mit Logo
        </span>
      </header>

      <main className="layout">
        {/* ---------------- Controls ---------------- */}
        <section className="controls">
          <h1 className="title">
            Dein QR-Code,<br />
            <em>endlich schön.</em>
          </h1>
          <p className="lede">
            Abgerundete Module, eigene Farben und ein Logo mitten im Code —
            alles live in der Vorschau.
          </p>

          <div className="field">
            <label className="field-label">
              <Sparkles size={15} /> Inhaltstyp
            </label>
            <div className="type-grid">
              {CONTENT_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    className={contentType === t.key ? "type-tab active" : "type-tab"}
                    onClick={() => setContentType(t.key)}
                  >
                    <Icon size={17} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label className="field-label">
              {active?.icon && <active.icon size={15} />} {active?.label}
            </label>
            {renderFields()}
          </div>

          <div className="field">
            <label className="field-label">
              <Grid2x2 size={15} /> Punkt-Stil
            </label>
            <div className="segmented">
              {DOT_STYLES.map((s) => (
                <button
                  key={s.value}
                  className={dotsType === s.value ? "seg active" : "seg"}
                  onClick={() => setDotsType(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">
              <Frame size={15} /> Ecken-Augen
            </label>
            <div className="segmented">
              {CORNER_STYLES.map((s) => (
                <button
                  key={s.value}
                  className={cornerType === s.value ? "seg active" : "seg"}
                  onClick={() => setCornerType(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label">
                <Palette size={15} /> Punkt-Farbe
              </label>
              <div className="color-control">
                <input
                  type="color"
                  value={dotsColor}
                  onChange={(e) => setDotsColor(e.target.value)}
                />
                <span className="hex">{dotsColor}</span>
              </div>
              <div className="swatches">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    className="swatch"
                    style={{ background: c }}
                    onClick={() => setDotsColor(c)}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <div className="field">
              <label className="field-label">
                <Palette size={15} /> Hintergrund
              </label>
              <div className="color-control">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <span className="hex">{bgColor}</span>
              </div>
              <div className="swatches">
                {["#ffffff", "#f5f1e8", "#0f1115", "#fef3c7", "#e0f2fe", "#fce7f3"].map(
                  (c) => (
                    <button
                      key={c}
                      className="swatch"
                      style={{ background: c }}
                      onClick={() => setBgColor(c)}
                      title={c}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="field">
            <label className="field-label">
              <Maximize2 size={15} /> Logo-Größe
              <span className="value">{Math.round(imageSize * 100)}%</span>
            </label>
            <input
              className="slider"
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label">
              <Frame size={15} /> Rand um Logo
              <span className="value">{imageMargin}px</span>
            </label>
            <input
              className="slider"
              type="range"
              min="0"
              max="24"
              step="1"
              value={imageMargin}
              onChange={(e) => setImageMargin(e.target.value)}
            />
          </div>

          <button className="reset-btn" onClick={handleResetStyle}>
            <RotateCcw size={15} />
            <span>Stil zurücksetzen</span>
          </button>
        </section>

        {/* ---------------- Preview ---------------- */}
        <section className="preview-col">
          <div className="preview-card">
            <div className="paper" style={{ background: bgColor }}>
              <div ref={previewRef} className="qr-host" />
            </div>
            <div className="preview-meta">
              <ScanLine size={14} />
              <span>Fehlerkorrektur H — bleibt trotz Logo scanbar</span>
            </div>
            <div className="actions">
              <button className="btn primary" onClick={() => download("png")}>
                <FileImage size={17} /> PNG
              </button>
              <button className="btn" onClick={() => download("svg")}>
                <FileCode2 size={17} /> SVG
              </button>
              <button className="btn" onClick={() => download("jpeg")}>
                <Download size={17} /> JPG
              </button>
            </div>
          </div>

          <div className="logo-panel">
            <label className="field-label">
              <ImagePlus size={15} /> Logo in der Mitte
            </label>
            {logo ? (
              <div className="logo-chip">
                <img src={logo} alt="" />
                <span className="logo-name">{logoName}</span>
                <button className="icon-btn" onClick={removeLogo} title="Entfernen">
                  <Trash2 size={15} />
                </button>
              </div>
            ) : (
              <button
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={20} />
                <span>Bild auswählen</span>
                <small>PNG, SVG oder JPG — wird automatisch zentriert</small>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogo}
              hidden
            />
            {logoError && (
              <p className="field-error">
                <AlertTriangle size={14} /> {logoError}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="footer-service">
          ein Service von{" "}
          <a href="https://hkp-solutions.de" target="_blank" rel="noopener noreferrer">
            hasenkamp solutions
          </a>
          {" & "}
          <a href="https://hasenkamp.dev" target="_blank" rel="noopener noreferrer">
            hasenkamp.dev
          </a>
        </span>
        <nav className="footer-links">
          <button onClick={() => setLegalModal("impressum")}>Impressum</button>
          <span className="dot">·</span>
          <button onClick={() => setLegalModal("datenschutz")}>Datenschutz</button>
        </nav>
      </footer>

      <LegalModal open={legalModal !== null} onClose={() => setLegalModal(null)}>
        {legalModal === "impressum" && <Impressum />}
        {legalModal === "datenschutz" && <Datenschutz />}
      </LegalModal>
    </div>
  );
}
