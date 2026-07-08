import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Airports', () => {
  it('GET /airports returns a paginated list', async () => {
    const res = await request(app).get('/airports');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('GET /airports?q= searches by name or code', async () => {
    const res = await request(app).get('/airports').query({ q: 'BOM' });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('GET /airports?cityId= filters by city', async () => {
    const res = await request(app).get('/airports').query({ cityId: 'jai' });
    expect(res.status).toBe(200);
    expect(res.body.items.every((a: any) => a.cityId === 'jai')).toBe(true);
  });

  it('GET /airports/:code returns a single airport (case-insensitive)', async () => {
    const res = await request(app).get('/airports/bom');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe('BOM');
  });

  it('GET /airports/:code 404s for unknown code', async () => {
    const res = await request(app).get('/airports/zzz');
    expect(res.status).toBe(404);
  });
});
