import type {EANNumber} from "@/common/model/EANNumber.ts";
import {useEffect, useState} from "react";
import {type ProductInfo, QueryError, queryProductByEAN} from "@/common/productQuery.ts";

export function useEANQuery(ean: EANNumber) {
  const [product, setProduct] = useState<ProductInfo | undefined>(undefined)
  const [error, setError] = useState<string | undefined>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    (async () => {
      try {
        const data = await queryProductByEAN(ean.toString());
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
    })()
  }, [ean])
  return {product, error, loading};
}
