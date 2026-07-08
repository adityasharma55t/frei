import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Cities', () => {
  it('GET /cities returns a paginated list', async () => {
    const res = await request(app).get('/cities');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(20); // default limit
  });

  it('GET /cities?q= filters by name', async () => {
    const res = await request(app).get('/cities').query({ q: 'jaipur' });
    expect(res.status).toBe(200);
    expect(res.body.items.every((c: any) => c.name.toLowerCase().includes('jaipur'))).toBe(true);
  });

  it('GET /cities?countryCode= filters by country', async () => {
    const res = await request(app).get('/cities').query({ countryCode: 'IN' });
    expect(res.status).toBe(200);
    expect(res.body.items.every((c: any) => c.countryCode === 'IN')).toBe(true);
  });

  it('GET /cities respects page & limit', async () => {
    const res = await request(app).get('/cities').query({ page: 1, limit: 5 });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(5);
  });

  it('GET /cities/:cityId returns a single city', async () => {
    const res = await request(app).get('/cities/jai');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('jai');
    expect(res.body.name).toBe('Jaipur');
  });

  it('GET /cities/:cityId 404s for unknown city', async () => {
    const res = await request(app).get('/cities/zzz');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('GET /cities/:cityId/hotels returns hotels for that city', async () => {
    const res = await request(app).get('/cities/jai/hotels');
    expect(res.status).toBe(200);
    expect(res.body.items.every((h: any) => h.cityId === 'jai')).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('GET /cities/:cityId/hotels filters by minStars', async () => {
    const res = await request(app).get('/cities/jai/hotels').query({ minStars: 5 });
    expect(res.status).toBe(200);
    expect(res.body.items.every((h: any) => h.starRating >= 5)).toBe(true);
  });

  it('GET /cities/:cityId/hotels 404s for unknown city', async () => {
    const res = await request(app).get('/cities/zzz/hotels');
    expect(res.status).toBe(404);
  });

  it('GET /cities/:cityId/attractions returns attractions for that city', async () => {
    const res = await request(app).get('/cities/jai/attractions');
    expect(res.status).toBe(200);
    expect(res.body.items.every((a: any) => a.cityId === 'jai')).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('GET /cities/:cityId/attractions filters by category', async () => {
    const res = await request(app).get('/cities/jai/attractions').query({ category: 'landmark' });
    expect(res.status).toBe(200);
    expect(res.body.items.every((a: any) => a.category === 'landmark')).toBe(true);
  });

  it('GET /cities/:cityId/attractions 404s for unknown city', async () => {
    const res = await request(app).get('/cities/zzz/attractions');
    expect(res.status).toBe(404);
  });
});
