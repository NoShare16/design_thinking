import type { Profile } from "@/lib/matching";

const LS_KEY = "allergenProfiles";

// strings normalisieren: lowercase, "_" -> "-"
const normAllergen = (s: string) => s.trim().toLowerCase().replace(/_/g, "-");
const normIngredient = (s: string) => s.trim().toLowerCase();

// schmale Runtype-Guard (stellt sicher, dass ein Objekt wie Profile aussieht)
function isProfile(u: unknown): u is Profile {
  if (typeof u !== "object" || u === null) return false;
  const p = u as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    Array.isArray(p.allergens) &&
    Array.isArray(p.ingredients) &&
    p.allergens.every((x) => typeof x === "string") &&
    p.ingredients.every((x) => typeof x === "string")
  );
}

export function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // validieren + normalisieren
    const cleaned: Profile[] = [];
    for (const item of parsed) {
      if (!isProfile(item)) continue;
      cleaned.push({
        id: item.id,
        name: item.name,
        allergens: item.allergens.map(normAllergen).filter(Boolean),
        ingredients: item.ingredients.map(normIngredient).filter(Boolean),
      });
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function saveProfiles(list: Profile[]): void {
  const safe = list.map((p) => ({
    ...p,
    allergens: p.allergens.map(normAllergen).filter(Boolean),
    ingredients: p.ingredients.map(normIngredient).filter(Boolean),
  }));
  localStorage.setItem(LS_KEY, JSON.stringify(safe));
}

// neues Profil hinzufügen (id generieren, normalisieren, speichern) gibt das angelegte Profil zurück
export function addProfile(input: {
  name: string;
  allergens?: string[];
  ingredients?: string[];
  id?: string; // optional, falls man eine mitgeben möchte
}): Profile {
  const list = loadProfiles();
  const id =
    input.id ??
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10));

  const profile: Profile = {
    id,
    name: input.name?.trim() || "Ohne Titel",
    allergens: (input.allergens ?? []).map(normAllergen).filter(Boolean),
    ingredients: (input.ingredients ?? []).map(normIngredient).filter(Boolean),
  };

  list.push(profile);
  saveProfiles(list);
  return profile;
}

// vorhandenes Profil ersetzen/aktualisieren (per id)
export function upsertProfile(p: Profile): void {
  const list = loadProfiles();
  const idx = list.findIndex((x) => x.id === p.id);
  const normalized: Profile = {
    ...p,
    allergens: p.allergens.map(normAllergen).filter(Boolean),
    ingredients: p.ingredients.map(normIngredient).filter(Boolean),
  };
  if (idx >= 0) list[idx] = normalized;
  else list.push(normalized);
  saveProfiles(list);
}

// Profil löschen
export function removeProfile(id: string): void {
  const list = loadProfiles().filter((p) => p.id !== id);
  saveProfiles(list);
}

// alle löschen
export function clearProfiles(): void {
  localStorage.removeItem(LS_KEY);
}
