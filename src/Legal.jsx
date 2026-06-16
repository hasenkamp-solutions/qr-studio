import { X } from "lucide-react";

export function Impressum() {
  return (
    <div className="legal-content">
      <h2>Impressum</h2>

      <h3>Angaben gemäß § 5 DDG</h3>
      <p>
        hasenkamp solutions
        <br />
        Tim Hasenkamp
        <br />
        Bombergstraße 8
        <br />
        36115 Hilders
        <br />
        Deutschland
      </p>

      <h3>Kontakt</h3>
      <p>
        Telefon: +49 6681 967 3822
        <br />
        E-Mail: <a href="mailto:info@hkp-solutions.de">info@hkp-solutions.de</a>
      </p>

      <h3>Umsatzsteuer</h3>
      <p>
        Kleinunternehmer gemäß § 19 Abs. 1 UStG. Es wird keine Umsatzsteuer
        ausgewiesen.
      </p>

      <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
      <p>Tim Hasenkamp, Anschrift wie oben.</p>

      <h3>Haftung für Inhalte</h3>
      <p>
        Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach
        den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht
        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
        überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
        Tätigkeit hinweisen.
      </p>
    </div>
  );
}

export function Datenschutz() {
  return (
    <div className="legal-content">
      <h2>Datenschutzerklärung</h2>

      <h3>1. Verantwortlicher</h3>
      <p>
        Tim Hasenkamp – hasenkamp solutions
        <br />
        Bombergstraße 8, 36115 Hilders
        <br />
        E-Mail: <a href="mailto:info@hkp-solutions.de">info@hkp-solutions.de</a>
      </p>

      <h3>2. Verarbeitung im Browser</h3>
      <p>
        Dieser QR-Code-Generator verarbeitet alle Eingaben (Inhalte, Farben und
        hochgeladene Logos) ausschließlich lokal in Ihrem Browser. Es werden
        <strong> keine eingegebenen Inhalte oder hochgeladenen Bilder</strong> an
        einen Server übertragen oder dort gespeichert. Der erzeugte QR-Code
        entsteht vollständig auf Ihrem Gerät.
      </p>

      <h3>3. Hosting &amp; Server-Logfiles</h3>
      <p>
        Diese Seite wird bei <strong>Cloudflare</strong> gehostet (Cloudflare,
        Inc., 101 Townsend Street, San Francisco, CA 94107, USA). Beim Aufruf
        verarbeitet Cloudflare automatisch technisch notwendige Zugriffsdaten
        (Server-Logfiles): IP-Adresse, Datum und Uhrzeit, abgerufene Datei,
        Browsertyp und -version, Betriebssystem sowie Referrer-URL.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
        am sicheren und stabilen Betrieb).
      </p>
      <p>
        Eine Übermittlung in die USA kann nicht ausgeschlossen werden; sie
        erfolgt auf Grundlage der EU-Standardvertragsklauseln. Mit Cloudflare
        besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO).
      </p>

      <h3>4. Schriftarten</h3>
      <p>
        Die verwendeten Schriftarten werden lokal vom Server dieser Seite
        ausgeliefert. Es findet <strong>keine Verbindung zu Drittanbietern</strong>{" "}
        (z. B. Google Fonts) und somit keine Übertragung Ihrer IP-Adresse an
        Dritte statt.
      </p>

      <h3>5. Ihre Rechte</h3>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
        der Verarbeitung, Datenübertragbarkeit sowie Widerspruch (Art. 15–21
        DSGVO). Außerdem besteht ein Beschwerderecht bei einer
        Datenschutz-Aufsichtsbehörde.
      </p>

      <h3>6. Kontakt</h3>
      <p>
        Bei Fragen zum Datenschutz erreichen Sie uns unter{" "}
        <a href="mailto:info@hkp-solutions.de">info@hkp-solutions.de</a>.
      </p>
    </div>
  );
}

export function LegalModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Schließen">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
