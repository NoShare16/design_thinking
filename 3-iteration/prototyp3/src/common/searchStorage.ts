export type RecentSearch = {
  ean: string;
  name: string;
  ts: number; // wann gesucht
};

const KEY = "recentEanSearches";
const MAX = 5;

function load(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // sanity check
    return arr
      .map((r) => ({
        ean: String(r?.ean ?? "").trim(),
        name: String(r?.name ?? "").trim(),
        ts: Number(r?.ts ?? 0),
      }))
      .filter((r) => r.ean.length > 0);
  } catch {
    return [];
  }
}

function save(arr: RecentSearch[]) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function getRecentSearches(): RecentSearch[] {
  return load();
}

export function addRecentSearch(input: {
  ean: string;
  name: string;
}): RecentSearch[] {
  const ean = String(input.ean ?? "").trim();
  const name = String(input.name ?? "").trim();
  if (!ean) return getRecentSearches();

  const now = Date.now();
  const current = load();

  // Dedupe nach EAN: vorhandene entfernen
  const filtered = current.filter((r) => r.ean !== ean);

  // neu vorne einsortieren
  const next: RecentSearch[] = [{ ean, name, ts: now }, ...filtered].slice(
    0,
    MAX
  );

  save(next);
  return next;
}

export function removeRecentSearch(ean: string): RecentSearch[] {
  const next = load().filter((r) => r.ean !== ean);
  save(next);
  return next;
}

export function clearRecentSearches() {
  save([]);
}
