/**
 * @jest-environment node
 */
const request = require('supertest');
const app = require('../server');

describe('CORS on the API', () => {
  test('dev default allows the Vite dev server origin', async () => {
    const res = await request(app)
      .get('/subject')
      .set('X-organisation', 'cors-org')
      .set('Origin', 'http://localhost:3000');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  test('unknown origin is rejected', async () => {
    const res = await request(app)
      .get('/subject')
      .set('X-organisation', 'cors-org')
      .set('Origin', 'https://evil.example');
    expect(res.status).toBe(403);
  });
});
