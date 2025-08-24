import {useEffect, useMemo, useState} from "react";
import type {ProductInfo} from "@/common/productQuery.ts";
import {QueryError, queryProductByEAN} from "@/common/productQuery.ts";
import {MatchLevel, matchProduct} from "@/common/matching";
import type {Profile} from "@/common/matching.ts";
import {loadProfiles} from "@/common/profileStorage";
import "./ProductDemo.css"
import {DetailedProductInfos} from "@/components/DetailedProductInfos.tsx";

export default function ProductDemo() {
  const [ean, setEan] = useState("");
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Profile aus localStorage laden (nur einmal beim Mount)
  useEffect(() => {
    setProfiles(loadProfiles());
  }, []);

  async function handleSearch() {
    setLoading(true);
    setProduct(null);
    setError(null);

    try {
      const data = await queryProductByEAN(ean.trim());
      setProduct(data);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === QueryError.NOT_FOUND) {
        setError("Produkt nicht gefunden.");
      } else if (e instanceof Error) {
        setError("Fehler: " + e.message);
      } else {
        setError("Unbekannter Fehler");
      }
    } finally {
      setLoading(false);
    }
  }

  // Ergebnisse für alle Profile berechnen, sobald ein Produkt da ist
  const profileMatches = useMemo(() => {
    if (!product) return [];
    return profiles.map((p) => ({
      id: p.id,
      name: p.name,
      result: matchProduct(p, product),
    }));
  }, [product, profiles]);

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        fontFamily: "system-ui, Segoe UI, Roboto, Inter, Arial, sans-serif",
      }}
    >
      {/* Suche */}
      <section className="pd-card">
        <h2 className="pd-title">Produkt-Suche per EAN</h2>
        <div className="pd-row">
          <input
            type="text"
            inputMode="numeric"
            placeholder="EAN eingeben (z. B. 4071800001012)"
            value={ean}
            onChange={(e) => setEan(e.target.value)}
            className="pd-input"
          />
        </div>
        <div className="pd-row" style={{ marginTop: 8 }}>
          <button
            onClick={handleSearch}
            disabled={!ean.trim() || loading}
            className="pd-btn pd-btn--primary"
            aria-busy={loading}
          >
            {loading ? "Lade…" : "Suchen"}
          </button>
          <button
            onClick={() => {
              setEan("");
              setProduct(null);
              setError(null);
            }}
            className="pd-btn"
            disabled={loading}
          >
            Zurücksetzen
          </button>
        </div>
        {error && <div className="pd-error">{error}</div>}
      </section>

      {/* Produktinfos */}
      {product && (
        <DetailedProductInfos product={product} className="pd-card"/>
      )}

      {/* Profile + Ergebnisanzeige (OK/BLOCK) */}
      {product && (
        <section className="pd-card">
          <h3 className="pd-subtitle">Profile (Match)</h3>

          {profiles.length === 0 ? (
            <div className="pd-empty">
              Keine Profile gefunden. Lege Profile im Profilmanager an.
            </div>
          ) : (
            <div className="pd-profiles-grid">
              {profileMatches.map(({ id, name, result }) => {
                const isBlock = result.level === MatchLevel.BLOCK;
                const title = isBlock
                  ? [
                      result.matchedAllergens.length
                        ? `Allergene: ${result.matchedAllergens.join(", ")}`
                        : null,
                      result.matchedIngredients.length
                        ? `Zutaten: ${result.matchedIngredients.join(", ")}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" | ")
                  : "OK";

                return (
                  <div
                    key={id}
                    className={`pd-profile ${
                      isBlock ? "pd-profile--block" : "pd-profile--ok"
                    }`}
                    aria-label={`${name}: ${isBlock ? "BLOCK" : "OK"}`}
                    title={title}
                  >
                    <div className="pd-pill">
                      <span className="pd-dot" />
                      <span className="pd-profile-name">{name}</span>
                      <span
                        className={`pd-badge ${
                          isBlock ? "pd-badge--block" : "pd-badge--ok"
                        }`}
                      >
                        {isBlock ? "BLOCK" : "OK"}
                      </span>
                    </div>

                    {isBlock && (
                      <div className="pd-reasons">
                        {result.matchedAllergens.length > 0 && (
                          <div>
                            <strong>Allergene:</strong>{" "}
                            {result.matchedAllergens.join(", ")}
                          </div>
                        )}
                        {result.matchedIngredients.length > 0 && (
                          <div>
                            <strong>Zutaten:</strong>{" "}
                            {result.matchedIngredients.join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
