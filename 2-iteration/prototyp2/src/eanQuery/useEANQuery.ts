import type {Allergen} from "@/common/Allergens.ts";
import useOpenFoodFacts from "@/eanQuery/openFoodFacts/useOpenFoodFacts.ts";
import type {EANNumber} from "@/common/EANNumber.ts";

//WIP:

interface IngredientInfo {
  //TODO this should be id
  id_name: string,
  percent_estimate: number
  percent_min: number
  percent_max: number
  display_name: string
}

interface ProductInfo {
  name: string
  brand: string
  allergens: Allergen[]
  ingredients: IngredientInfo[]
  display_image: string
}

enum QueryError {
  NOT_FOUND = 'NOT_FOUND',
  NO_SEARCH = 'NO_SEARCH',
  OTHER = 'OTHER',
}

export default function useEANQuery(ean: EANNumber): ProductInfo | QueryError {
  return QueryError.OTHER
}
