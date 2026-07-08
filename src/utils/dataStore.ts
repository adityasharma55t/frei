import * as fs from 'fs';
import * as path from 'path';
import { City, Airport, Hotel, Attraction, Flight, Booking } from '../types';
import { MODEL_REGISTRY } from './modelRegistry';

const DATA_DIR = path.join(__dirname, '..', 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

function loadJson<T>(file: string): T {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  return JSON.parse(raw) as T;
}

// Static reference data — loaded once at boot. Admin CRUD mutates these
// arrays in place (push/splice/index-assign) so every existing import of
// these bindings keeps seeing live updates without further changes.
export const cities: City[] = loadJson<City[]>('cities.json');
export const airports: Airport[] = loadJson<Airport[]>('airports.json');
export const hotels: Hotel[] = loadJson<Hotel[]>('hotels.json');
export const attractions: Attraction[] = loadJson<Attraction[]>('attractions.json');
export const flights: Flight[] = loadJson<Flight[]>('flights.json');

// Bookings — persisted back to disk on every write.
// Note: on Render's ephemeral filesystem this resets on redeploy/restart,
// and won't be shared across multiple instances. Swap for a real DB
// (e.g. Postgres) if you need durability across deploys/scaling.
const bookingsCache: Booking[] = loadJson<Booking[]>('bookings.json');

export function getBookings(): Booking[] {
  return bookingsCache;
}

export function saveBookings(next: Booking[]): void {
  // `next` is often the same array reference as `bookingsCache` (callers
  // commonly do `getBookings().push(...)` then pass it straight back in),
  // so snapshot it before clearing to avoid wiping out our own input.
  const snapshot = next.slice();
  bookingsCache.length = 0;
  bookingsCache.push(...snapshot);
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookingsCache, null, 2));
}

/** Test helper: reset in-memory bookings without touching disk. */
export function _resetBookingsForTests(bookings: Booking[] = []): void {
  const snapshot = bookings.slice();
  bookingsCache.length = 0;
  bookingsCache.push(...snapshot);
}

// Generic access for the admin CRUD layer — keyed by modelRegistry.key.
const stores: Record<string, unknown[]> = {
  cities,
  airports,
  hotels,
  attractions,
  flights,
  bookings: bookingsCache,
};

export function getStore(modelKey: string): unknown[] | undefined {
  return stores[modelKey];
}

export function persistModel(modelKey: string): void {
  const def = MODEL_REGISTRY.find((d) => d.key === modelKey);
  const data = stores[modelKey];
  if (!def || !data) return;
  fs.writeFileSync(path.join(DATA_DIR, def.file), JSON.stringify(data, null, 2));
}

/** Test helper: reset an in-memory model store without touching disk. */
export function _resetModelForTests(modelKey: string, records: unknown[]): void {
  const arr = stores[modelKey];
  if (!arr) return;
  const snapshot = records.slice();
  arr.length = 0;
  arr.push(...snapshot);
}
