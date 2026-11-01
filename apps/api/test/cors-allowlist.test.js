/**
 * @jest-environment node
 */
const express = require('express');
const request = require('supertest');
const { isOriginAllowed, corsAllowlist } = require('../cors-allowlist');

const STAGING = ['https://*.roisalen.pages.dev'];
const PRODUCTION = ['https://roisalen.no'];

describe('isOriginAllowed', () => {
  test.each([
    ['https://abc123.roisalen.pages.dev', STAGING, true],
    ['https://feature-x.roisalen.pages.dev', STAGING, true],
    ['https://ABC123.roisalen.pages.dev', STAGING, true],
    ['https://roisalen.pages.dev', STAGING, false],
    ['https://a.b.roisalen.pages.dev', STAGING, false],
    ['https://evilroisalen.pages.dev', STAGING, false],
    ['https://abc.roisalen.pages.dev.evil.com', STAGING, false],
    ['http://abc.roisalen.pages.dev', STAGING, false],
    ['https://roisalen.no', PRODUCTION, true],
    ['https://www.roisalen.no', PRODUCTION, false],
    ['http://roisalen.no', PRODUCTION, false],
    ['https://roisalen.no:8443', PRODUCTION, false],
    ['https://abc.roisalen.pages.dev', PRODUCTION, false],
    ['null', PRODUCTION, false],
  ])('%s against %j -> %s', (origin, patterns, expected) => {
    expect(isOriginAllowed(origin, patterns)).toBe(expected);
  });
});

describe('corsAllowlist middleware', () => {
  const app = express();
  app.use(corsAllowlist(PRODUCTION));
  app.get('/ping', (req, res) => res.send('pong'));

  test('allowed origin gets its origin echoed back', async () => {
    const res = await request(app).get('/ping').set('Origin', 'https://roisalen.no');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('https://roisalen.no');
  });

  test('disallowed origin is rejected with 403 and no CORS header', async () => {
    const res = await request(app).get('/ping').set('Origin', 'https://evil.example');
    expect(res.status).toBe(403);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  test('request without Origin passes (health checks, curl)', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.text).toBe('pong');
  });

  test('preflight from allowed origin allows the method and X-organisation header', async () => {
    const res = await request(app)
      .options('/ping')
      .set('Origin', 'https://roisalen.no')
      .set('Access-Control-Request-Method', 'DELETE')
      .set('Access-Control-Request-Headers', 'x-organisation,content-type');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('https://roisalen.no');
    expect(res.headers['access-control-allow-methods']).toContain('DELETE');
    expect(res.headers['access-control-allow-headers']).toBe('x-organisation,content-type');
  });

  test('preflight from disallowed origin is rejected', async () => {
    const res = await request(app)
      .options('/ping')
      .set('Origin', 'https://evil.example')
      .set('Access-Control-Request-Method', 'DELETE');
    expect(res.status).toBe(403);
  });
});
