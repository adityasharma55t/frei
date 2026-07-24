/**
 * One-off enrichment script that replaces the placeholder `image` URLs
 * (https://cdn.frei.app/...) in the seed JSON with real, working image
 * URLs — Wikipedia lead photos for real cities/landmarks, and themed
 * LoremFlickr stock photos (deterministic per id) for fictional hotels
 * and generated filler attractions.
 *
 * Not part of the runtime server. Run with: npm run fetch-images
 * Re-run any time after `npm run generate-seed` to refill image fields.
 */
import * as fs from 'fs';
import * as path from 'path';
import type { City, Hotel, Attraction, AttractionCategory } from '../src/types';

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const UA = 'frei-booking-api-seed-script/1.0 (https://github.com/frei; seed data enrichment)';

function readJson<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf-8')) as T;
}
function writeJson(name: string, data: unknown): void {
  fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(data, null, 2));
  console.log(`updated ${name}`);
}

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 1000;
}

function loremFlickr(tags: string[], seedId: string, w = 800, h = 600): string {
  // LoremFlickr's tag path segment wants spaces as '+', not %20 — percent
  // encoding there gets rejected with a 403.
  const tag = tags.map((t) => t.trim().replace(/\s+/g, '+')).join(',');
  return `https://loremflickr.com/${w}/${h}/${tag}/all?lock=${hashSeed(seedId)}`;
}

// Two-step Wikimedia Commons lookup: `list=search` returns file titles in
// actual relevance-rank order (a JSON array), which a single
// generator=search+prop=imageinfo call would not — that response keys
// pages by numeric pageid, and JS/JSON object key ordering for
// integer-like keys is ascending-numeric, not relevance order. So rank is
// fetched separately, then imageinfo is looked up per title in that order.
async function commonsImage(query: string, width = 800): Promise<string | null> {
  try {
    const searchRes = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=5&format=json&srsearch=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': UA } },
    );
    if (!searchRes.ok) return null;
    const searchJson: any = await searchRes.json();
    const titles: string[] = (searchJson.query?.search ?? []).map((s: any) => s.title);
    if (titles.length === 0) return null;

    const infoRes = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|mime&iiurlwidth=${width}&format=json&titles=${encodeURIComponent(titles.join('|'))}`,
      { headers: { 'User-Agent': UA } },
    );
    if (!infoRes.ok) return null;
    const infoJson: any = await infoRes.json();
    const pagesByTitle = new Map<string, any>(
      (Object.values(infoJson.query?.pages ?? {}) as any[]).map((p) => [p.title, p]),
    );

    for (const title of titles) {
      const info = pagesByTitle.get(title)?.imageinfo?.[0];
      if (info && /^image\/(jpeg|png)$/.test(info.mime)) {
        return info.thumburl ?? info.url;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function firstCommonsImage(queries: string[], width = 800): Promise<string | null> {
  for (const q of queries) {
    const img = await commonsImage(q, width);
    if (img) return img;
  }
  return null;
}

// Search queries where the plain city name is too ambiguous on its own
// (e.g. "Male" collides with unrelated Commons categories).
const CITY_QUERY_OVERRIDES: Record<string, string[]> = {
  mle: ['Malé Maldives city', 'Malé atoll'],
};

const CATEGORY_TAGS: Record<AttractionCategory, string[]> = {
  landmark: ['landmark', 'architecture'],
  museum: ['museum', 'gallery'],
  nature: ['nature', 'park'],
  nightlife: ['nightlife', 'bar'],
  food: ['street food', 'market'],
  shopping: ['bazaar', 'market'],
  adventure: ['adventure', 'outdoor'],
};

// Suffixes used by generate-seed.ts's GENERIC_ATTRACTION_TEMPLATES — any
// attraction named "<City> <suffix>" is filler, not a real place, so it
// goes straight to the themed stock-photo fallback instead of Wikipedia.
const GENERIC_SUFFIXES = [
  'City Landmark',
  'Heritage Museum',
  'Central Park',
  'Old Town Market',
  'Riverside Promenade',
  'Night Bazaar',
  'Food Street',
];

async function main() {
  const cities = readJson<City[]>('cities.json');
  const hotels = readJson<Hotel[]>('hotels.json');
  const attractions = readJson<Attraction[]>('attractions.json');
  const cityById = new Map(cities.map((c) => [c.id, c]));

  console.log(`Fetching images for ${cities.length} cities...`);
  for (const c of cities) {
    const queries = CITY_QUERY_OVERRIDES[c.id] ?? [`${c.name} ${c.country} cityscape`, c.name];
    const img = await firstCommonsImage(queries);
    c.image = img ?? loremFlickr([c.name, 'skyline'], c.id);
    console.log(`  ${c.name}: ${img ? 'commons' : 'fallback'}`);
  }

  console.log(`Fetching images for ${attractions.length} attractions...`);
  for (const a of attractions) {
    const city = cityById.get(a.cityId)!;
    const isGeneric = GENERIC_SUFFIXES.some((suf) => a.name === `${city.name} ${suf}`);
    let img: string | null = null;
    if (!isGeneric) {
      img = await firstCommonsImage([`${a.name} ${city.name}`, a.name]);
    }
    a.image = img ?? loremFlickr([...CATEGORY_TAGS[a.category], city.name], a.id);
    console.log(`  ${a.name}: ${img ? 'commons' : 'fallback'}`);
  }

  console.log(`Building themed stock photos for ${hotels.length} hotels...`);
  for (const h of hotels) {
    const tier = h.starRating >= 4.5 ? 'luxury resort' : h.starRating >= 3.5 ? 'boutique hotel' : 'budget hotel';
    const amenityTag = h.amenities.includes('Pool') ? 'pool' : h.amenities.includes('Spa') ? 'spa' : 'hotel room';
    h.image = loremFlickr([tier, amenityTag], h.id);
  }

  writeJson('cities.json', cities);
  writeJson('attractions.json', attractions);
  writeJson('hotels.json', hotels);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
