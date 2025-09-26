import request from 'supertest';
import { app } from '../app.js';

describe('sweet shop route setup', () => {
  test('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Welcome to Sweet Shop API');
  });
});
