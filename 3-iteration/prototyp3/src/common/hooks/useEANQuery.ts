import type {EANNumber} from "@/common/model/EANNumber.ts";
import {useEffect, useState} from "react";
import {type ProductInfo, QueryError, queryProductByEAN} from "@/common/productQuery.ts";

export function useEANQuery(ean: EANNumber) {
  const [product, setProduct] = useState<ProductInfo | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      if (ean === 0) {
        return;
      }
      setLoading(true);
      setError(undefined);
      try {
        const data = await queryProductByEAN(ean.toString());
        setProduct(data);
      } catch (e: unknown) {
        if (e instanceof Error && e.message === QueryError.NOT_FOUND) {
          setError("Produkt konnte nicht gefunden werden.");
        } else {
          setError("Beim suchen des Produktes ist ein Fehler aufgetreten: " + (e as Error).message);
        }
      } finally {
        setLoading(false);
      }
    })()
  }, [ean])
  return {product, error, loading};
}
