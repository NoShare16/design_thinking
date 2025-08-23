import type {ProductInfo} from "@/common/productQuery.ts";
import type {AllergenProfile} from "@/common/model/AllergenProfile.ts";

const norm = (s: string) => s.trim().toLowerCase().replace(/_/g, "-");
const stripLocalePrefix = (t: string) => t.replace(/^[a-z]{2,3}:/i, "");
const slug = (s: string) => norm(stripLocalePrefix(s)).replace(/[^a-z0-9]+/g, "-");

export const MatchLevel = { OK: "ok", BLOCK: "block" } as const;
export type MatchLevel = (typeof MatchLevel)[keyof typeof MatchLevel];

export interface MatchResult {
  level: MatchLevel;
  matchedAllergens: string[];
  matchedIngredients: string[];
}

// Helpers
function unique<T>(arr: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const key = typeof x === "string" ? slug(x) : JSON.stringify(x);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(x);
    }
  }
  return out;
}

// Allergene↔︎Allergene (strikt via OFF-Codes)
function matchAllergens(profile: AllergenProfile, product: ProductInfo): string[] {
  const productAllergens = new Set(product.allergens.map(norm));
  const hits: string[] = [];
  for (const code of profile.allergens) {
    if (productAllergens.has(code)) hits.push(code);
  }
  return unique(hits);
}

// Ingredients↔︎Ingredients (Slug-Gleichheit/Enthalten)
function matchIngredients(profile: AllergenProfile, product: ProductInfo): string[] {
  const terms = profile.ingredients.map(slug);
  if (terms.length === 0) return [];

  const names = product.ingredients.flatMap((ing) => [
    ing.id_name,
    ing.display_name,
  ]);
  const nameSlugs = names.map(slug);

  const hits: string[] = [];
  for (let i = 0; i < nameSlugs.length; i++) {
    const ingredientSlug = nameSlugs[i];
    const originalName = names[i];
    for (const term of terms) {
      if (ingredientSlug === term || ingredientSlug.includes(term)) {
        hits.push(originalName || term);
      }
    }
  }
  return unique(hits);
}

// Kern
export function matchProduct(
  profile: AllergenProfile,
  product: ProductInfo
): MatchResult {
  const matchedAllergens = matchAllergens(profile, product);
  const matchedIngredients = matchIngredients(profile, product);

  if (matchedAllergens.length > 0 || matchedIngredients.length > 0) {
    return { level: MatchLevel.BLOCK, matchedAllergens, matchedIngredients };
  }
  return { level: MatchLevel.OK, matchedAllergens: [], matchedIngredients: [] };
}
