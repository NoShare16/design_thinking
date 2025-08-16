import "./home.css";

export default function Home({ onGoProfiles }) {
  return (
    <div className="home">
      {/* Header */}
      <header className="hero">
        <div className="hero__badge">Demo • Prototype</div>
        <h1 className="hero__title">Allergy Alert</h1>
        <p className="hero__subtitle">
          Scanne Produkte, verwalte Profile und erkenne Allergene auf einen
          Blick.
        </p>

        <div className="hero__actions">
          <button
            className="btn btn--primary"
            title="Neues Profil anlegen"
            aria-label="Neues Profil anlegen"
          >
            ➕ Irgendwas hinzufügen
          </button>
          <button
            className="btn btn--neutral"
            title="Profile verwalten"
            aria-label="Profile verwalten"
            onClick={onGoProfiles}
          >
            ⚙️ Profile verwalten
          </button>
          <button
            className="btn btn--accent"
            title="Produkt scannen"
            aria-label="Produkt scannen"
          >
            📷 Produkt scannen
          </button>
        </div>

        <div className="hero__note">
          * Buttons sind Platzhalter – Funktionen folgen in der nächsten
          Iteration.
        </div>
      </header>

      {/* Feature Cards */}
      <section className="features" aria-label="Funktionen">
        <article className="card">
          <div className="card__icon">📋</div>
          <h3 className="card__title">Profile</h3>
          <p className="card__text">
            Lege individuelle Allergie-Profile an (z. B. für Familie).
          </p>
          <div className="chip">Geplant</div>
        </article>

        <article className="card">
          <div className="card__icon">🔍</div>
          <h3 className="card__title">Scanner</h3>
          <p className="card__text">
            Barcode oder Zutatenliste prüfen und sofortige Ampelbewertung
            erhalten.
          </p>
          <div className="chip">Geplant</div>
        </article>

        <article className="card">
          <div className="card__icon">⚠️</div>
          <h3 className="card__title">Warnungen</h3>
          <p className="card__text">Klare Hinweise zu Allergenen und Spuren.</p>
          <div className="chip">Geplant</div>
        </article>
      </section>

      {/* Info Strip */}
      <section className="strip" role="note">
        <p>
          Datenquelle: <strong>OpenFoodFacts</strong>. Keine Anmeldung nötig.
          Deine Profile bleiben lokal in deinem Browser.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        © {new Date().getFullYear()} Allergy Alert • Demo-Version
      </footer>
    </div>
  );
}
