import type {ProductInfo} from "@/common/productQuery.ts";
import "./ProductDemo.css"

export function DetailedProductInfos(props: { product: ProductInfo, className?: string }) {
  return <section className={props.className}>
    <h3 className="pd-subtitle">Produkt</h3>
    <div className="pd-info">
      <div className="pd-line">
        <span className="pd-k">Name</span>
        <span className="pd-v">{props.product.name || "–"}</span>
      </div>
      <div className="pd-line">
        <span className="pd-k">Marke</span>
        <span className="pd-v">{props.product.brand || "–"}</span>
      </div>
      <div className="pd-line">
        <span className="pd-k">EAN</span>
        <span className="pd-v">{props.product.ean}</span>
      </div>
      <div className="pd-line">
        <span className="pd-k">Allergene (aus Quelle)</span>
        <span className="pd-v">
                {props.product.allergens.length
                  ? props.product.allergens.join(", ")
                  : "keine Angabe"}
              </span>
      </div>
      <div className="pd-line pd-wrapping-line">
        <span className="pd-k">Zutaten</span>
        <span className="pd-v">
                {props.product.ingredients.length
                  ? props.product.ingredients
                    .map((i) => i.display_name || i.id_name)
                    .join(", ")
                  : "keine Angabe"}
              </span>
      </div>
    </div>
  </section>;
}
