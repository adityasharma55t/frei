# Frei Booking API

Node.js + Express + TypeScript backend implementing `frei-booking-api_openapi.yaml`:
cities, airports, flights, hotels, attractions, and trip bookings for the Frei
travel app.

- **Data backing:** static seed JSON files under `src/data/` (40 cities, 40
  airports, 119 hotels, 199 attractions, 266 flights). `bookings.json` is the
  only mutable store — read and written at runtime.
- **Auth:** `bearerAuth` is modeled in the OpenAPI spec but **not enforced**
  server-side, matching the spec's own notes. All endpoints are open.

## Project layout

```
src/
  app.ts              Express app assembly (routes + middleware)
  server.ts            Entry point, reads PORT from env
  types.ts             Shared TS types matching the OpenAPI schemas
  data/                 Static seed JSON (generated — see below)
  routes/               One file per resource (cities, airports, flights, hotels, bookings)
  utils/
    dataStore.ts        Loads seed JSON, reads/writes bookings.json
    pagination.ts       Shared page/limit query parsing
  middleware/
    errorHandler.ts      HttpError class + JSON error responses
scripts/
  generate-seed.ts       One-off generator that produced src/data/*.json
tests/                    Jest + Supertest suite (37 tests, one file per resource)
```

## Running locally

```bash
npm install
npm run dev        # ts-node-dev, hot reload, http://localhost:4000
```

Build & run the compiled JS (what Render runs):

```bash
npm run build       # tsc + copies src/data/*.json into dist/data/
npm start            # node dist/server.js
```

## Tests

```bash
npm test
```

37 tests cover every route: happy paths, pagination, filtering/sorting,
validation errors (400) and not-found errors (404) for cities, airports,
flights, hotels, and the full booking create/list/get/cancel flow.

## Regenerating seed data

`scripts/generate-seed.ts` is not part of the runtime server — it's what
produced `src/data/*.json`. Edit it (e.g. to add more cities or routes) and
re-run:

```bash
npm run generate-seed
```

This overwrites `cities.json`, `airports.json`, `hotels.json`,
`attractions.json`, and `flights.json`. It resets `bookings.json` to `[]`
if that file doesn't already exist — it won't clobber existing bookings.

## Deploying to Render

A `render.yaml` blueprint is included.

1. Push this repo to GitHub.
2. In the Render dashboard: **New > Blueprint**, point it at the repo — it
   will pick up `render.yaml` automatically (build: `npm install && npm run
   build`, start: `npm start`, health check: `/health`).
   - Alternatively, **New > Web Service** manually with the same build/start
     commands, runtime Node, and no extra env vars required (`PORT` is
     injected by Render automatically).
3. Deploy. The service will be reachable at `https://<your-service>.onrender.com`.

### A note on the bookings store

Render's filesystem is **ephemeral** — `bookings.json` resets on every
redeploy/restart and isn't shared across instances if you scale beyond one.
That's expected for this seed-data-driven demo. If you need bookings to
survive deploys, swap `src/utils/dataStore.ts`'s `getBookings`/`saveBookings`
for calls to a real database (Postgres, etc.) — the rest of the app doesn't
need to change since routes only go through those two functions.

## Enabling auth later

The `Authorization: Bearer <Firebase ID token>` header is accepted but not
verified. To enforce it: add Firebase Admin SDK verification middleware,
apply it to the `/bookings` routes (per the OpenAPI `security` blocks), and
flip those routes from optional to required auth.
