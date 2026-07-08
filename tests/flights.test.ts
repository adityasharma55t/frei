import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Flights', () => {
  it('GET /flights requires from & to', async () => {
    const res = await request(app).get('/flights');
    expect(res.status).toBe(400);
  });

  it('GET /flights?from=&to= returns matching flights', async () => {
    const res = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL' });
    expect(res.status).toBe(200);
    expect(res.body.items.every((f: any) => f.fromAirport === 'BOM' && f.toAirport === 'DEL')).toBe(true);
  });

  it('GET /flights sorts by price by default', async () => {
    const res = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL' });
    expect(res.status).toBe(200);
    const prices = res.body.items.map((f: any) => f.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it('GET /flights sorts by duration when requested', async () => {
    const res = await request(app).get('/flights').query({ from: 'BOM', to: 'DXB', sort: 'duration' });
    expect(res.status).toBe(200);
    const durations = res.body.items.map((f: any) => f.durationMinutes);
    const sorted = [...durations].sort((a, b) => a - b);
    expect(durations).toEqual(sorted);
  });

  it('GET /flights filters by travelers (seat availability)', async () => {
    const res = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL', travelers: 200 });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(0);
  });

  it('GET /flights/:flightId returns a single flight', async () => {
    const list = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL', limit: 1 });
    const flightId = list.body.items[0].id;
    const res = await request(app).get(`/flights/${flightId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(flightId);
  });

  it('GET /flights/:flightId 404s for unknown id', async () => {
    const res = await request(app).get('/flights/does-not-exist');
    expect(res.status).toBe(404);
  });
});
