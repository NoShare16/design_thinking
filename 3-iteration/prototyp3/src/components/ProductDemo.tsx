import {
  useState,
  type HTMLAttributes,
  type ReactNode,
  FormEvent,
} from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DetailedProductInfos } from "@/components/DetailedProductInfos.tsx";
import {
  type ProductInfo,
  QueryError,
  queryProductByEAN,
} from "@/common/productQuery.ts";
import { useFoodWarnings } from "@/common/hooks/useFoodWarnings.ts";

import DiamondAlertIcon from "@/assets/diamond_alert.tsx";
import DiamondCheckIcon from "@/assets/diamond_check.tsx";
import AlertIconBare from "@/assets/explamation_mark.tsx";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/components/ui/sheet.tsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shadcn/components/ui/carousel.tsx";

import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  type RecentSearch,
} from "@/common/searchStorage";

// Styles: nutzt Scanner-Layout + Demo-Ergänzungen
import "../screens/scannerScreen/ProductScanner.css";
import "./ProductDemo.css";

export default function ProductDemo() {
  const nav = useNavigate();

  const [ean, setEan] = useState("");
  const [product, setProduct] = useState<ProductInfo | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Zuletzt gesucht (aus LocalStorage)
  const [recents, setRecents] = useState<RecentSearch[]>(() =>
    getRecentSearches()
  );

  const warnings = useFoodWarnings(product);

  async function handleSearch(e?: FormEvent) {
    if (e) e.preventDefault();
    setTouched(true);

    const eanTrim = ean.trim();
    if (!eanTrim) return;

    setLoading(true);
    setProduct(undefined);
    setError(null);

    try {
      const data = await queryProductByEAN(eanTrim);
      setProduct(data);

      // In "zuletzt gesucht" speichern (max. 5, dedupe)
      setRecents(
        addRecentSearch({
          ean: data.ean,
          name: data.name || "Unbenanntes Produkt",
        })
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message === QueryError.NOT_FOUND) {
        setError("Produkt nicht gefunden.");
      } else if (err instanceof Error) {
        setError("Fehler: " + err.message);
      } else {
        setError("Unbekannter Fehler.");
      }
    } finally {
      setLoading(false);
    }
  }

  function truncateName(name: string, max = 25) {
    return name.length > max ? name.slice(0, max - 1) + "…" : name;
  }

  return (
    <div className="productScannerScreen">
      <header onClick={() => nav("/")}>
        <ArrowLeft />
        <h1>ProductDemo</h1>
      </header>

      <div className="contentBody">
        {/* EAN Suchkarte an Stelle der Kamera */}
        <form
          className="productScannerCard eanSearchCard"
          onSubmit={handleSearch}
        >
          <label htmlFor="ean-input" className="eanLabel">
            EAN suchen
          </label>
          <div className="eanRow">
            <input
              id="ean-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="EAN eingeben (z. B. 4071800001012)"
              value={ean}
              onChange={(e) => setEan(e.target.value)}
              className="eanInput"
            />
            <button
              type="submit"
              className="eanBtn"
              disabled={!ean.trim() || loading}
              aria-busy={loading}
            >
              {loading ? "Lade…" : "Suchen"}
            </button>
          </div>

          {/* Zuletzt gesucht */}
          {recents.length > 0 && (
            <div className="recentBox">
              <div className="recentHeader">Letzte Suchen</div>
              <ul className="recentList">
                {recents.map((r) => (
                  <li key={r.ean} className="recentItemRow">
                    <button
                      type="button"
                      className="recentItem"
                      onClick={() => {
                        setEan(r.ean);
                        // Optional: direkt suchen
                        // setTouched(true); handleSearch();
                      }}
                      title={r.name ? `${r.name} — ${r.ean}` : r.ean}
                    >
                      <span className="recentName">
                        {truncateName(r.name || "Unbenannt")}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="recentRemove"
                      aria-label={`Suche ${r.ean} entfernen`}
                      onClick={() => setRecents(removeRecentSearch(r.ean))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {/* Ergebnis-Karte wie im Scanner */}
        {touched && product && (
          <ResultCard product={product} warnings={warnings} />
        )}

        {/* Initial-/Statuskarten */}
        {!touched && (
          <div className="productScannerCard textCard">
            Gib eine EAN ein und bestätige mit „Suchen“.
          </div>
        )}
        {loading && (
          <div className="productScannerCard textCard">Loading...</div>
        )}
        {touched && !loading && error && (
          <div className="productScannerCard textCard">{error}</div>
        )}
      </div>
    </div>
  );
}

/* ====== Reuse der Darstellung aus dem Scanner ====== */

type FoodWarningReturn = {
  person_name: string;
  has_warning: boolean;
  matching_allergens: string[];
  matching_ingredients: string[];
};

function ResultCard({
  product,
  warnings,
}: {
  product: ProductInfo;
  warnings: FoodWarningReturn[];
}) {
  const hasAWarning = warnings.map((w) => w.has_warning).some(Boolean);

  return (
    <DetailPopup warnings={warnings} product={product}>
      <div
        className={
          hasAWarning
            ? "hasWarning productScannerCard"
            : "isOkay productScannerCard"
        }
      >
        <div className="productInfo">
          <div className="imageContainer">
            <img src={product.display_image} alt={"Image of " + product.name} />
          </div>
          <div className="content">
            <h1>{product.name}</h1>
            <h3>EAN: #{product.ean}</h3>
            <h2>{product.brand}</h2>
          </div>
        </div>
        <hr />
        <div className="warnings">
          <div className="headline">
            {hasAWarning ? (
              <DiamondAlertIcon className="warningIcon" />
            ) : (
              <DiamondCheckIcon className="okIcon" />
            )}
            <p>{hasAWarning ? "Warning" : "Okay"}</p>
          </div>
          <div className="personList">
            {warnings.map((value, i) => (
              <div
                key={`${value.person_name}-${i}`}
                style={{ display: "contents" }}
              >
                <PersonResult warning={value} />
                <div className="verticalSeparator" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DetailPopup>
  );
}

function PersonResult({ warning }: { warning: FoodWarningReturn }) {
  const causeHint = [
    ...warning.matching_allergens,
    ...warning.matching_ingredients,
  ];

  return (
    <div className="person">
      <CircularWarningIcon isWarning={warning.has_warning} />
      <div className="name">{warning.person_name}</div>
      <div className="warningCauseList">
        {causeHint.length > 3 &&
          causeHint.slice(0, 2).map((v) => (
            <div key={v} className="warning">
              {v}
            </div>
          ))}
        {causeHint.length > 3 && (
          <div className="warning">and {causeHint.length - 2} others...</div>
        )}
        {causeHint.length <= 3 &&
          causeHint.map((v) => (
            <div key={v} className="warning">
              {v}
            </div>
          ))}
      </div>
    </div>
  );
}

type DetailPopupProps = {
  children: ReactNode;
  warnings: FoodWarningReturn[];
  product: ProductInfo;
};

function DetailPopup({ warnings, children, product }: DetailPopupProps) {
  return (
    <Sheet>
      <SheetTrigger className="sheetTrigger">{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        style={{ backgroundColor: "white", height: "100%" }}
      >
        <SheetHeader>
          <SheetTitle className="sheetTitle">Details</SheetTitle>
        </SheetHeader>
        <div className="sheetContent">
          <DetailedProductInfos product={product} className="detailSection" />
          <div className="detailSection">
            <h3 className="pd-subtitle">Personen:</h3>
            <Carousel orientation="horizontal" opts={{ loop: true }}>
              <CarouselContent>
                {warnings.map((value, i) => (
                  <CarouselItem
                    key={`${value.person_name}-${i}`}
                    className="carouselPerson"
                  >
                    <CircularWarningIcon
                      isWarning={value.has_warning}
                      style={{ width: "5rem" }}
                    />
                    <h2>{value.person_name}</h2>
                    <div className="resultContent">
                      <h3>Allergens:</h3>
                      <div>
                        {value.matching_allergens.map((v) => (
                          <div key={v}>{v}</div>
                        ))}
                      </div>
                      <h3>Incompatible ingredients:</h3>
                      <div>
                        {value.matching_ingredients.map((v) => (
                          <div key={v}>{v}</div>
                        ))}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface CircularWarningIconProps extends HTMLAttributes<HTMLDivElement> {
  isWarning: boolean;
}

function CircularWarningIcon(props: CircularWarningIconProps) {
  return (
    <div
      className={props.isWarning ? "circleIcon isWarning" : "circleIcon"}
      {...props}
    >
      {props.isWarning ? <AlertIconBare /> : <Check />}
    </div>
  );
}
