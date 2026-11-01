/**
 * @jest-environment node
 */
const request = require('supertest');
const app = require('../../server');
const { serverVersion } = require('../helpers/mongo');

describe('GET /status', () => {
  test('pings the database', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.text).toBe('db is ok :)\n');
  });

  test('test database is MongoDB 7.x or 8.x (what Atlas runs)', async () => {
    const version = await serverVersion();
    expect(['7', '8']).toContain(version.split('.')[0]);
  });
});
