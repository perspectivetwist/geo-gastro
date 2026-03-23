export default function Datenschutz() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-white mb-8">Datenschutzerklärung</h1>

        <div className="space-y-6 text-gray-300 font-light text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-medium mb-2">Verantwortlicher</h2>
            <p>
              AI-SHIFT-DRIFT<br />
              Berliner Straße 124, 13187 Berlin<br />
              E-Mail: asd.gastronomie@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-white font-medium mb-2">Datenverarbeitung</h2>
            <p>
              Dieser Service speichert keine personenbezogenen Daten auf unseren Servern.
              Die eingegebene URL wird ausschließlich zur Analyse verwendet und nicht gespeichert.
            </p>
          </section>

          <section>
            <h2 className="text-white font-medium mb-2">E-Mail-Adresse</h2>
            <p>
              Wenn Sie Ihre E-Mail-Adresse eingeben, wird diese ausschließlich lokal in Ihrem
              Browser (localStorage) gespeichert, um den Freischalt-Status zu merken.
              Es erfolgt keine serverseitige Speicherung oder Weitergabe an Dritte.
            </p>
          </section>

          <section>
            <h2 className="text-white font-medium mb-2">Cookies</h2>
            <p>
              Wir verwenden keine Tracking-Cookies. Es werden ausschließlich technisch
              notwendige Technologien (localStorage) eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="text-white font-medium mb-2">Hosting</h2>
            <p>
              Diese Seite wird über Vercel gehostet. Vercel kann technische
              Zugriffsdaten (IP-Adresse, Zeitstempel) in Server-Logs erfassen.
            </p>
          </section>

          <section>
            <h2 className="text-white font-medium mb-2">Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
              Verarbeitung Ihrer Daten. Da wir keine personenbezogenen Daten serverseitig speichern,
              können Sie Ihre lokal gespeicherten Daten jederzeit über die Browser-Einstellungen löschen.
            </p>
            <p className="mt-2">
              Bei Fragen wenden Sie sich an: asd.gastronomie@gmail.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
