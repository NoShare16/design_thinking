import type { ProductInfo } from "@/common/productQuery.ts";

// -- OFF-Allergene-Whitelist (normalisiert: lowercase, _ -> -)
const RAW_ALLOWED = [
  "pork",
  "fish",
  "celery",
  "peanuts",
  "sulphur_dioxide_and_sulphites",
  "crustaceans",
  "beef",
  "eggs",
  "lupin",
  "apple",
  "gluten",
  "nuts",
  "soybeans",
  "orange",
  "milk",
  "matsutake",
  "kiwi",
  "none",
  "gelatin",
  "peach",
  "sesame_seeds",
  "banana",
  "yamaimo",
  "chicken",
  "molluscs",
  "mustard",
  "red_caviar",
] as const;

const norm = (s: string) => s.trim().toLowerCase().replace(/_/g, "-");
const stripLocalePrefix = (t: string) => t.replace(/^[a-z]{2,3}:/i, "");
const slug = (s: string) =>
  norm(stripLocalePrefix(s)).replace(/[^a-z0-9]+/g, "-");

export const ALLOWED_ALLERGENS = new Set(Array.from(RAW_ALLOWED, norm));

// -- Typen
export interface Profile {
  id: string;
  name: string;
  // Nur OFF-Codes, normalisiert (siehe ALLOWED_ALLERGENS)
  allergens: string[];
  // Frei definierbare Zutaten-Begriffe/Synonyme (z. B. "wheat", "rye", "casein", "malt", ...)
  ingredients: string[];
}

export const MatchLevel = {
  OK: "ok",
  BLOCK: "block",
} as const;
export type MatchLevel = (typeof MatchLevel)[keyof typeof MatchLevel];

export interface MatchResult {
  level: MatchLevel;
  matchedAllergens: string[]; // getroffene Allergen-Codes (normalisiert)
  matchedIngredients: string[]; // Zutaten-Treffer (Begriffe aus Profil ODER Produktnamen, s.u.)
}

// -- 3 harte Profile (Beispiele)
export const HARD_PROFILES: Profile[] = [
  {
    id: "p1",
    name: "Gluten & Milch (inkl. typische Zutaten)",
    allergens: [norm("gluten"), norm("milk")],
    ingredients: [
      // gluten-typisch
      "wheat",
      "rye",
      "barley",
      "oats",
      "spelt",
      "malted-barley",
      "malt",
      "dinkel",
      // milch-typisch
      "milk",
      "lactose",
      "milk-proteins",
      "casein",
      "whey",
    ],
  },
  {
    id: "p2",
    name: "Nüsse, Erdnuss & Sesam",
    allergens: [norm("nuts"), norm("peanuts"), norm("sesame_seeds")],
    ingredients: [
      "nuts",
      "almonds",
      "hazelnuts",
      "walnuts",
      "cashews",
      "pistachios",
      "pecan-nuts",
      "brazil-nuts",
      "macadamia-nuts",
      "peanut",
      "peanuts",
      "sesame",
      "sesame-seeds",
    ],
  },
  {
    id: "p3",
    name: "Fisch / Krebstiere / Weichtiere",
    allergens: [norm("fish"), norm("crustaceans"), norm("molluscs")],
    ingredients: [
      "fish",
      "tuna",
      "salmon",
      "cod",
      "herring",
      "anchovy",
      "sardine",
      "shrimp",
      "prawn",
      "crab",
      "lobster",
      "krill",
      "oyster",
      "clam",
      "mussel",
      "octopus",
      "squid",
    ],
  },
];

// -- Matching-Helfer
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

// Striktes Allergene↔︎Allergene Matching
function matchAllergens(profile: Profile, product: ProductInfo): string[] {
  const productAllergens = new Set(
    product.allergens.map(norm).filter((code) => ALLOWED_ALLERGENS.has(code))
  );
  const hits: string[] = [];
  for (const code of profile.allergens) {
    if (productAllergens.has(code)) hits.push(code);
  }
  return unique(hits);
}

// Striktes Ingredients↔︎Ingredients Matching
// Regel: wir vergleichen Slugs. Ein Treffer, wenn der Produkt-Ingredient-Slug dem Profil-Term-Slug entspricht ODER ihn enthält (z. B. "malted-barley" enthält "barley").
function matchIngredients(profile: Profile, product: ProductInfo): string[] {
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
        // für die UI: lieber den tatsächlich gefundenen Ingredient-Namen zeigen
        hits.push(originalName || term);
      }
    }
  }
  return unique(hits);
}

// -- Kern: getrennte Kanäle, beide können blocken
export function matchProduct(
  profile: Profile,
  product: ProductInfo
): MatchResult {
  const matchedAllergens = matchAllergens(profile, product);
  const matchedIngredients = matchIngredients(profile, product);

  if (matchedAllergens.length > 0 || matchedIngredients.length > 0) {
    return { level: MatchLevel.BLOCK, matchedAllergens, matchedIngredients };
  }
  return { level: MatchLevel.OK, matchedAllergens: [], matchedIngredients: [] };
}
