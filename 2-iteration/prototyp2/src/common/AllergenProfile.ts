import type {Allergen} from "@/common/Allergens.ts";

export interface AllergenProfile {
  name: string;
  allergens: Allergen[];
}
