import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Hotels', () => {
  it('GET /hotels/:hotelId returns a single hotel', async () => {
    const list = await request(app).get('/cities/jai/hotels');
    const hotelId = list.body.items[0].id;
    const res = await request(app).get(`/hotels/${hotelId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(hotelId);
  });

  it('GET /hotels/:hotelId 404s for unknown id', async () => {
    const res = await request(app).get('/hotels/does-not-exist');
    expect(res.status).toBe(404);
  });
});
