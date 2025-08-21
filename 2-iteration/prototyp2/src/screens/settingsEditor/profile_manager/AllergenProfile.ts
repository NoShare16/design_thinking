import type {Allergen} from "@/Allergens.ts";

export interface AllergenProfile {
  name: string;
  allergens: Allergen[];
}
