import type {EANNumber} from "@/common/EANNumber.ts";
import type {Allergen} from "@/common/Allergens.ts";
import {allergenMatcher} from "@/common/Allergens.ts";


interface OpenFoodFactsQueryReturn {
  _id: string
  _keywords: string[]
  allergens: string
  allergens_from_ingredients: string
  //TODO check format and if useful
  allergens_hierarchy: []
  brands: string
  brands_tags: string[]
  data_quality_info_tags: string[]
  data_quality_tags: string[]
  data_quality_warnings_tags: string[]
  data_sources_tags: string[]
  image_front_small_url: string
  image_front_thumb_url: string
  image_front_url: string
  ingredients: {
    ciqual_proxy_food_code: string
    id: string
    percent_estimate: number
    percent_min: number
    percent_max: number
    rank: number
    text: string
    vegan: string
    vegetarian: string
  }[]
  ingredients_analysis_tags: string[]
  ingredients_hierarchy: string[]
}

export default async function useOpenFoodFacts(product: EANNumber): Promise<Allergen[]> {
  //TODO error handling
  const res = await fetch("https://world.openfoodfacts.org/api/v0/product/" + product + ".json")
  if (!res.ok) {
    console.log("Error useOpenfoodfacts", res);
  }
  const json = await res.json();
  const allergs: string = json.product.allergens;

  console.log("raw: ", json);
  console.log("OpenFoodFactsQueryReturn: ", json.product as unknown as OpenFoodFactsQueryReturn);

  return allergs.split(",").map((product: string) => allergenMatcher.get(product.trim())).filter(value => value !== undefined);
}

