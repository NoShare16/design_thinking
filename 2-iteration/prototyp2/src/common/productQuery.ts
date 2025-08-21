// -- Common types
export type AllergenCode = string;

export interface IngredientInfo {
  id_name: string; // z. B. "en:wheat" oder Klartext-Fallback
  display_name: string; // für UI lesbar
  percent_estimate: number | null;
  percent_min: number | null;
  percent_max: number | null;
}

export interface ProductInfo {
  ean: string;
  name: string;
  brand: string;
  allergens: AllergenCode[]; // z. B. ["gluten","sesame-seeds"]
  ingredients: IngredientInfo[];
  display_image: string; // optionales Bild
}

export const QueryError = {
  NOT_FOUND: "NOT_FOUND",
  NO_SEARCH: "NO_SEARCH",
  NETWORK: "NETWORK",
  PARSE: "PARSE",
  OTHER: "OTHER",
} as const;

export type QueryError = (typeof QueryError)[keyof typeof QueryError];

// -- Adapter contract (für spätere weitere Quellen)
export interface SourceAdapter {
  name: string;
  fetchByEAN(ean: string): Promise<ProductInfo>;
}

// -- Utils
const isEANLike = (s: string) => /^[0-9]{8,14}$/.test(s); // simple EAN check
const stripLocale = (t: string) => t.replace(/^[a-z]{2,3}:/i, ""); // "en:wheat" -> "wheat"
const toStr = (v: unknown) => (v ?? "").toString().trim(); // safe string
const toNumOrNull = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? v : null; // safe number

// -- Minimaltypen für OpenFoodFacts (nur Felder, die wir nutzen)
interface OFFIngredient {
  id?: string;
  text?: string;
  percent_estimate?: number;
  percent_min?: number;
  percent_max?: number;
}

type LangMap = Record<string, string>; // z. B. { de: url, en: url }

interface OFFSelectedFront {
  display?: LangMap;
  small?: LangMap;
  thumb?: LangMap;
}

interface OFFSelectedImages {
  front?: OFFSelectedFront;
}

interface OFFProduct {
  product_name_de?: string;
  product_name?: string;
  generic_name_de?: string;
  generic_name?: string;
  brands?: string;
  image_url?: string;
  selected_images?: OFFSelectedImages;
  allergens_tags?: string[];
  allergens?: string;
  ingredients?: OFFIngredient[];
}

interface OFFResponse {
  status: number; // 1 = found, 0 = not found
  product?: OFFProduct;
}

// -- Parser für OFF (streng typisiert)
function pickImage(p: OFFProduct): string {
  const sel =
    p.selected_images?.front?.display ??
    p.selected_images?.front?.small ??
    p.selected_images?.front?.thumb;
  if (sel?.de) return sel.de;
  if (sel?.en) return sel.en;
  const first = sel ? Object.values(sel)[0] : undefined;
  return toStr(p.image_url) || toStr(first);
}

function parseIngredients(p: OFFProduct): IngredientInfo[] {
  const arr = Array.isArray(p.ingredients) ? p.ingredients : [];
  return arr.map((ing): IngredientInfo => {
    const id = toStr(ing.id) || toStr(ing.text) || "unknown";
    const display =
      toStr(ing.text) || (ing.id ? stripLocale(ing.id) : "unknown");
    return {
      id_name: id,
      display_name: display,
      percent_estimate: toNumOrNull(ing.percent_estimate),
      percent_min: toNumOrNull(ing.percent_min),
      percent_max: toNumOrNull(ing.percent_max),
    };
  });
}

function parseAllergens(p: OFFProduct): AllergenCode[] {
  if (Array.isArray(p.allergens_tags) && p.allergens_tags.length > 0) {
    return p.allergens_tags.map(stripLocale);
  }
  const s = toStr(p.allergens);
  if (!s) return [];
  return s
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map(stripLocale);
}

// -- OpenFoodFacts Adapter
class OFFAdapter implements SourceAdapter {
  name = "OpenFoodFacts";

  async fetchByEAN(ean: string): Promise<ProductInfo> {
    if (!isEANLike(ean)) throw new Error(QueryError.NO_SEARCH);

    const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(
      ean
    )}.json`;

    let json: OFFResponse;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(QueryError.NETWORK);
      json = (await res.json()) as OFFResponse;
    } catch {
      throw new Error(QueryError.NETWORK);
    }

    if (json.status !== 1 || !json.product)
      throw new Error(QueryError.NOT_FOUND);

    const p = json.product;
    const info: ProductInfo = {
      ean,
      name:
        toStr(p.product_name_de) ||
        toStr(p.product_name) ||
        toStr(p.generic_name_de) ||
        toStr(p.generic_name),
      brand: toStr(p.brands),
      allergens: parseAllergens(p),
      ingredients: parseIngredients(p),
      display_image: pickImage(p),
    };

    // Minimal-Validierung
    if (
      !info.name &&
      info.ingredients.length === 0 &&
      info.allergens.length === 0
    ) {
      throw new Error(QueryError.PARSE);
    }
    return info;
  }
}

// -- Orchestrator (aktuell nur OFF, später weitere Adapter ergänzen)
const ADAPTERS: SourceAdapter[] = [new OFFAdapter()];

export async function queryProductByEAN(ean: string): Promise<ProductInfo> {
  let last: unknown = null;
  for (const a of ADAPTERS) {
    try {
      return await a.fetchByEAN(ean);
    } catch (e: unknown) {
      last = e;
      // bei mehreren Quellen würde hier die nächste probiert
    }
  }
  if (
    last instanceof Error &&
    (Object.values(QueryError) as string[]).includes(last.message)
  ) {
    throw last;
  }
  throw new Error(QueryError.OTHER);
}
