import request from 'supertest';
import { createApp } from '../src/app';
import { _resetBookingsForTests } from '../src/utils/dataStore';

const app = createApp();

beforeEach(() => {
  _resetBookingsForTests([]);
});

// The bookings store persists to disk on write; reset the seed file back to
// empty once the suite finishes so repeated test runs stay deterministic.
afterAll(() => {
  _resetBookingsForTests([]);
  const fs = require('fs');
  const path = require('path');
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'bookings.json'), '[]');
});

describe('Bookings', () => {
  it('POST /bookings creates a flight booking and computes totalPrice', async () => {
    const flights = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL', limit: 1 });
    const flight = flights.body.items[0];

    const res = await request(app)
      .post('/bookings')
      .send({ type: 'flight', referenceId: flight.id, travelers: 2 });

    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^bkg_/);
    expect(res.body.status).toBe('confirmed');
    expect(res.body.type).toBe('flight');
    expect(res.body.totalPrice).toBe(flight.price * 2);
    expect(res.body.currency).toBe(flight.currency);
    expect(res.body.createdAt).toBeDefined();
  });

  it('POST /bookings creates a hotel booking', async () => {
    const hotels = await request(app).get('/cities/jai/hotels').query({ limit: 1 });
    const hotel = hotels.body.items[0];

    const res = await request(app).post('/bookings').send({
      type: 'hotel',
      referenceId: hotel.id,
      travelers: 2,
      checkIn: '2026-08-01',
      checkOut: '2026-08-04',
    });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe('hotel');
    expect(res.body.checkIn).toBe('2026-08-01');
    expect(res.body.checkOut).toBe('2026-08-04');
  });

  it('POST /bookings rejects an invalid type', async () => {
    const res = await request(app).post('/bookings').send({ type: 'bus', referenceId: 'x', travelers: 1 });
    expect(res.status).toBe(400);
  });

  it('POST /bookings rejects a missing referenceId', async () => {
    const res = await request(app).post('/bookings').send({ type: 'flight', travelers: 1 });
    expect(res.status).toBe(400);
  });

  it('POST /bookings rejects an unknown flight reference', async () => {
    const res = await request(app)
      .post('/bookings')
      .send({ type: 'flight', referenceId: 'does-not-exist', travelers: 1 });
    expect(res.status).toBe(400);
  });

  it('POST /bookings rejects invalid travelers', async () => {
    const res = await request(app)
      .post('/bookings')
      .send({ type: 'flight', referenceId: 'x', travelers: 0 });
    expect(res.status).toBe(400);
  });

  it('GET /bookings lists created bookings and filters by status', async () => {
    const flights = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL', limit: 1 });
    const flight = flights.body.items[0];
    const created = await request(app)
      .post('/bookings')
      .send({ type: 'flight', referenceId: flight.id, travelers: 1, userId: 'uid_test' });

    const list = await request(app).get('/bookings').query({ userId: 'uid_test' });
    expect(list.status).toBe(200);
    expect(list.body.items.some((b: any) => b.id === created.body.id)).toBe(true);
  });

  it('GET /bookings/:bookingId returns a single booking', async () => {
    const flights = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL', limit: 1 });
    const flight = flights.body.items[0];
    const created = await request(app)
      .post('/bookings')
      .send({ type: 'flight', referenceId: flight.id, travelers: 1 });

    const res = await request(app).get(`/bookings/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it('GET /bookings/:bookingId 404s for unknown id', async () => {
    const res = await request(app).get('/bookings/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('DELETE /bookings/:bookingId cancels a booking', async () => {
    const flights = await request(app).get('/flights').query({ from: 'BOM', to: 'DEL', limit: 1 });
    const flight = flights.body.items[0];
    const created = await request(app)
      .post('/bookings')
      .send({ type: 'flight', referenceId: flight.id, travelers: 1 });

    const res = await request(app).delete(`/bookings/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelled');
  });

  it('DELETE /bookings/:bookingId 404s for unknown id', async () => {
    const res = await request(app).delete('/bookings/does-not-exist');
    expect(res.status).toBe(404);
  });
});
