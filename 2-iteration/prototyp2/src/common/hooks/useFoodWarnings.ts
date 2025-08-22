import type {ProductInfo} from "@/common/productQuery.ts";
import useProfiles from "@/common/hooks/useProfiles.ts";
import {useEffect, useState} from "react";
import type {FoodWarningReturn} from "@/common/warningGenerator/useFoodWarningMock.ts";
import {matchProduct} from "@/common/matching.ts";

export function useFoodWarnings(product: ProductInfo | undefined) {
  const {profiles} = useProfiles();
  const [warnings, setWarnings] = useState<FoodWarningReturn[]>([])

  useEffect(() => {
    if (!product) {
      setWarnings([])
    } else {
      const map = profiles.map((p) => {
        const d = matchProduct(p, product);
        return {
          person_name: p.name,
          matching_allergens: d.matchedAllergens,
          matching_ingredients: d.matchedIngredients,
          has_warning: d.matchedIngredients.length + d.matchedIngredients.length > 0
        }
      });
      setWarnings(map);
    }
  }, [product, profiles]);
  return warnings;
}
