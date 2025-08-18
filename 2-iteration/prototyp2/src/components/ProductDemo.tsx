import React, { useState } from "react";
import { queryProductByEAN, QueryError } from "@/lib/productQuery";
import type { ProductInfo } from "@/lib/productQuery";

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

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Produkt-Suche per EAN</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="EAN eingeben (z. B. 4071800001012)"
          value={ean}
          onChange={(e) => setEan(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={!ean.trim() || loading}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Lade…" : "Suchen"}
        </button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {product && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "12px",
          }}
        >
          <h3>{product.name || "Unbenanntes Produkt"}</h3>
          {product.display_image && (
            <img
              src={product.display_image}
              alt={product.name}
              style={{ maxWidth: 260, borderRadius: 8, marginBottom: 12 }}
            />
          )}
          <p>
            <strong>Marke:</strong> {product.brand || "–"}
          </p>
          <p>
            <strong>EAN:</strong> {product.ean}
          </p>
          <p>
            <strong>Allergene:</strong>{" "}
            {product.allergens.length
              ? product.allergens.join(", ")
              : "keine Angabe"}
          </p>
          <p>
            <strong>Ingredients:</strong>{" "}
            {product.ingredients.length
              ? product.ingredients
                  .map((i) => i.display_name || i.id_name)
                  .join(", ")
              : "keine Angabe"}
          </p>
        </div>
      )}
    </div>
  );
}
