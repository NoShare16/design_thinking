import "./HomeScreen.css";
import {useNavigate} from "react-router-dom";

export default function HomeScreen() {
  const navigate = useNavigate();

  return <div className="home">
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
        >➕ Irgendwas hinzufügen
        </button>
        {/*TODO fix path when done*/}
        <button
          className="btn btn--neutral"
          title="Profile verwalten"
          aria-label="Profile verwalten"
          onClick={() => navigate("/profile_manager")}
        >⚙️ Profile verwalten
        </button>
        <button
          className="btn btn--accent"
          title="Produkt scannen"
          aria-label="Produkt scannen"
          onClick={() => navigate("/productScanner")}
        >📷 Produkt scannen
        </button>
      </div>

      <div className="hero__note">
        * Buttons sind Platzhalter – Funktionen folgen in der nächsten
        Iteration.
      </div>
    </header>

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
        <div className="card__icon">🔍</div>
        <h3 className="card__title">Bulk-Scanner</h3>
        <p className="card__text">
          Mehrere Barcodes nach einander Scannen und eine Tabelarische Zusammenfassung aller gescannten Produkte erhalten.
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

    <section className="strip" role="note">
      <p>
        Datenquelle: <strong>OpenFoodFacts</strong>. Keine Anmeldung nötig.
        Deine Profile bleiben lokal in deinem Browser.
      </p>
    </section>

    <footer className="footer" role="contentinfo">
      © {new Date().getFullYear()} Allergy Alert • Demo-Version
    </footer>
  </div>
}
