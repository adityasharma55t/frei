import * as fs from 'fs';
import * as path from 'path';
import request from 'supertest';
import { createApp } from '../src/app';
import { _resetModelForTests } from '../src/utils/dataStore';

const ADMIN_TOKEN = 'test-admin-token';
process.env.ADMIN_TOKEN = ADMIN_TOKEN;

const app = createApp();

const AIRPORTS_FILE = path.join(__dirname, '..', 'src', 'data', 'airports.json');
const ATTRACTIONS_FILE = path.join(__dirname, '..', 'src', 'data', 'attractions.json');

const originalAirports = JSON.parse(fs.readFileSync(AIRPORTS_FILE, 'utf-8'));
const originalAttractions = JSON.parse(fs.readFileSync(ATTRACTIONS_FILE, 'utf-8'));

function withToken(req: request.Test) {
  return req.set('X-Admin-Token', ADMIN_TOKEN);
}

beforeEach(() => {
  _resetModelForTests('airports', JSON.parse(JSON.stringify(originalAirports)));
  _resetModelForTests('attractions', JSON.parse(JSON.stringify(originalAttractions)));
});

afterAll(() => {
  _resetModelForTests('airports', originalAirports);
  _resetModelForTests('attractions', originalAttractions);
  fs.writeFileSync(AIRPORTS_FILE, JSON.stringify(originalAirports, null, 2));
  fs.writeFileSync(ATTRACTIONS_FILE, JSON.stringify(originalAttractions, null, 2));
});

describe('Admin auth', () => {
  it('rejects requests with no token', async () => {
    const res = await request(app).get('/admin/api/models');
    expect(res.status).toBe(401);
  });

  it('rejects requests with the wrong token', async () => {
    const res = await request(app).get('/admin/api/models').set('X-Admin-Token', 'wrong');
    expect(res.status).toBe(401);
  });

  it('accepts requests with the correct token', async () => {
    const res = await withToken(request(app).get('/admin/api/models'));
    expect(res.status).toBe(200);
  });
});

describe('GET /admin/api/models', () => {
  it('lists all six models with their schema', async () => {
    const res = await withToken(request(app).get('/admin/api/models'));
    const keys = res.body.map((m: any) => m.key);
    expect(keys.sort()).toEqual(['airports', 'attractions', 'bookings', 'cities', 'flights', 'hotels'].sort());
    const airports = res.body.find((m: any) => m.key === 'airports');
    expect(airports.idField).toBe('code');
    expect(airports.schema).toBeDefined();
  });

  it('404s for an unknown model', async () => {
    const res = await withToken(request(app).get('/admin/api/models/not-a-model'));
    expect(res.status).toBe(404);
  });
});

describe('Admin CRUD — airports (code-based id)', () => {
  it('lists and gets an airport', async () => {
    const list = await withToken(request(app).get('/admin/api/models/airports'));
    expect(list.status).toBe(200);
    expect(list.body.items.length).toBeGreaterThan(0);

    const get = await withToken(request(app).get('/admin/api/models/airports/BOM'));
    expect(get.status).toBe(200);
    expect(get.body.code).toBe('BOM');
  });

  it('creates, updates, and deletes an airport', async () => {
    const created = await withToken(request(app).post('/admin/api/models/airports')).send({
      code: 'ZZZ',
      name: 'Test Airport',
      cityId: 'bom',
      lat: 1,
      lng: 2,
    });
    expect(created.status).toBe(201);
    expect(created.body.code).toBe('ZZZ');

    const updated = await withToken(request(app).put('/admin/api/models/airports/ZZZ')).send({
      code: 'ZZZ',
      name: 'Renamed Test Airport',
      cityId: 'bom',
      lat: 1,
      lng: 2,
    });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Renamed Test Airport');

    const deleted = await withToken(request(app).delete('/admin/api/models/airports/ZZZ'));
    expect(deleted.status).toBe(200);

    const getAfterDelete = await withToken(request(app).get('/admin/api/models/airports/ZZZ'));
    expect(getAfterDelete.status).toBe(404);
  });

  it('rejects a duplicate code on create', async () => {
    const res = await withToken(request(app).post('/admin/api/models/airports')).send({
      code: 'BOM',
      name: 'Duplicate',
      cityId: 'bom',
      lat: 1,
      lng: 2,
    });
    expect(res.status).toBe(400);
  });

  it('rejects a missing required field on create', async () => {
    const res = await withToken(request(app).post('/admin/api/models/airports')).send({
      code: 'ZZZ',
      cityId: 'bom',
    });
    expect(res.status).toBe(400);
  });

  it('404s updating an unknown airport', async () => {
    const res = await withToken(request(app).put('/admin/api/models/airports/does-not-exist')).send({
      code: 'does-not-exist',
      name: 'X',
      cityId: 'bom',
      lat: 1,
      lng: 2,
    });
    expect(res.status).toBe(404);
  });

  it('404s deleting an unknown airport', async () => {
    const res = await withToken(request(app).delete('/admin/api/models/airports/does-not-exist'));
    expect(res.status).toBe(404);
  });
});

describe('Admin CRUD — attractions (id-based, enum validation)', () => {
  it('creates an attraction', async () => {
    const res = await withToken(request(app).post('/admin/api/models/attractions')).send({
      id: 'test-attraction',
      name: 'Test Attraction',
      cityId: 'bom',
      category: 'landmark',
      rating: 4.5,
      description: 'A test attraction',
      image: 'https://example.com/x.jpg',
    });
    expect(res.status).toBe(201);
  });

  it('rejects an invalid enum value for category', async () => {
    const res = await withToken(request(app).post('/admin/api/models/attractions')).send({
      id: 'test-attraction-2',
      name: 'Test Attraction 2',
      cityId: 'bom',
      category: 'not-a-real-category',
      rating: 4,
    });
    expect(res.status).toBe(400);
  });

  it('updates an attraction', async () => {
    await withToken(request(app).post('/admin/api/models/attractions')).send({
      id: 'test-attraction-3',
      name: 'Test Attraction 3',
      cityId: 'bom',
      category: 'landmark',
      rating: 4,
    });

    const res = await withToken(request(app).put('/admin/api/models/attractions/test-attraction-3')).send({
      id: 'test-attraction-3',
      name: 'Updated Name',
      cityId: 'bom',
      category: 'museum',
      rating: 5,
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.category).toBe('museum');
  });

  it('deletes an attraction', async () => {
    await withToken(request(app).post('/admin/api/models/attractions')).send({
      id: 'test-attraction-4',
      name: 'Test Attraction 4',
      cityId: 'bom',
      category: 'landmark',
      rating: 4,
    });

    const res = await withToken(request(app).delete('/admin/api/models/attractions/test-attraction-4'));
    expect(res.status).toBe(200);

    const getAfterDelete = await withToken(request(app).get('/admin/api/models/attractions/test-attraction-4'));
    expect(getAfterDelete.status).toBe(404);
  });
});
