import { useMemo, useState } from "react";
import { queryProductByEAN, QueryError } from "@/common/productQuery.ts";
import type { ProductInfo } from "@/common/productQuery.ts";
import { HARD_PROFILES, matchProduct } from "@/common/matching.ts";

export default function ProductDemo() {
  const [ean, setEan] = useState("");
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    return HARD_PROFILES.map((p) => ({
      id: p.id,
      name: p.name,
      result: matchProduct(p, product),
    }));
  }, [product]);

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        fontFamily: "system-ui, Segoe UI, Roboto, Inter, Arial, sans-serif",
      }}
    >
      <StyleBlock />

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
          <button
            onClick={handleSearch}
            disabled={!ean.trim() || loading}
            className="pd-btn pd-btn--primary"
            aria-busy={loading}
          >
            {loading ? "Lade…" : "Suchen"}
          </button>
        </div>
        {error && <div className="pd-error">{error}</div>}
      </section>

      {/* Produktinfos */}
      {product && (
        <section className="pd-card">
          <h3 className="pd-subtitle">Produkt</h3>
          <div className="pd-info">
            <div className="pd-line">
              <span className="pd-k">Name</span>
              <span className="pd-v">{product.name || "–"}</span>
            </div>
            <div className="pd-line">
              <span className="pd-k">Marke</span>
              <span className="pd-v">{product.brand || "–"}</span>
            </div>
            <div className="pd-line">
              <span className="pd-k">EAN</span>
              <span className="pd-v">{product.ean}</span>
            </div>
            <div className="pd-line">
              <span className="pd-k">Allergene (aus Quelle)</span>
              <span className="pd-v">
                {product.allergens.length
                  ? product.allergens.join(", ")
                  : "keine Angabe"}
              </span>
            </div>
            <div className="pd-line">
              <span className="pd-k">Zutaten</span>
              <span className="pd-v">
                {product.ingredients.length
                  ? product.ingredients
                      .map((i) => i.display_name || i.id_name)
                      .join(", ")
                  : "keine Angabe"}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Profile + Ergebnisanzeige (OK/BLOCK) */}
      {product && (
        <section className="pd-card">
          <h3 className="pd-subtitle">Profile (Match)</h3>
          <div className="pd-profiles">
            {profileMatches.map(({ id, name, result }) => {
              const isBlock = result.level === "block";
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
        </section>
      )}
    </div>
  );
}

// kleines CSS als Component – hält alles in einer Datei
function StyleBlock() {
  return (
    <style>{`
      .pd-card{border:1px solid #e5e7eb;border-radius:16px;padding:16px;margin:14px 0;background:#fff}
      .pd-title{margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a}
      .pd-subtitle{margin:0 0 10px;font-size:16px;font-weight:700;color:#111827}
      .pd-row{display:flex;gap:8px;align-items:center}
      .pd-input{flex:1;border:1px solid #d1d5db;border-radius:10px;padding:10px 12px;font-size:14px}
      .pd-btn{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
      .pd-btn[disabled]{opacity:.6;cursor:not-allowed}
      .pd-btn--primary:hover{filter:brightness(1.05)}
      .pd-error{margin-top:8px;color:#b91c1c;font-weight:600}
      .pd-info{display:grid;gap:6px}
      .pd-line{display:grid;grid-template-columns:160px 1fr;gap:8px;align-items:start}
      .pd-k{font-size:13px;color:#6b7280}
      .pd-v{font-size:14px;color:#111827}
      .pd-profiles{display:grid;gap:10px}
      .pd-profile{border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px}
      .pd-profile--ok{background:#f0fdf4;border-color:#bbf7d0}
      .pd-profile--block{background:#fef2f2;border-color:#fecaca}
      .pd-pill{display:flex;gap:8px;align-items:center;justify-content:space-between}
      .pd-dot{width:10px;height:10px;border-radius:999px;background:#10b981;box-shadow:0 0 0 2px #fff}
      .pd-profile--block .pd-dot{background:#ef4444}
      .pd-profile-name{font-weight:700;color:#111827}
      .pd-badge{font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid #e5e7eb;background:#fff;font-weight:700}
      .pd-badge--ok{border-color:#86efac;color:#065f46}
      .pd-badge--block{border-color:#fecaca;color:#991b1b}
      .pd-reasons{margin-top:8px;font-size:13px;color:#991b1b}
      @media (max-width: 520px){
        .pd-line{grid-template-columns:1fr}
      }
    `}</style>
  );
}
