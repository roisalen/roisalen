/**
 * @jest-environment node
 */
const config = require('../config');

describe('config', () => {
  const original = process.env;

  beforeEach(() => {
    process.env = { ...original, NODE_ENV: 'test' };
    delete process.env.MONGO_URI;
    delete process.env.PORT;
    delete process.env.ALLOWED_ORIGINS;
  });

  afterAll(() => {
    process.env = original;
  });

  describe('mongoUri', () => {
    test('defaults to the local roisalen database outside production', () => {
      expect(config.mongoUri()).toBe('mongodb://127.0.0.1:27017/roisalen');
    });

    test('uses MONGO_URI when set', () => {
      process.env.MONGO_URI = 'mongodb://db.example:27017/roisalen-staging';
      expect(config.mongoUri()).toBe('mongodb://db.example:27017/roisalen-staging');
    });

    test('throws in production when MONGO_URI is unset', () => {
      process.env.NODE_ENV = 'production';
      expect(() => config.mongoUri()).toThrow('MONGO_URI must be set in production');
    });
  });

  describe('port', () => {
    test('defaults to 8080', () => {
      expect(config.port()).toBe(8080);
    });

    test('uses PORT when it is a number', () => {
      process.env.PORT = '3001';
      expect(config.port()).toBe(3001);
    });

    test('falls back to 8080 when PORT is not a number', () => {
      process.env.PORT = 'abc';
      expect(config.port()).toBe(8080);
    });
  });

  describe('allowedOrigins', () => {
    test('splits, trims and strips trailing slashes', () => {
      process.env.ALLOWED_ORIGINS = ' https://roisalen.no/ , https://*.roisalen.pages.dev ,';
      expect(config.allowedOrigins()).toEqual(['https://roisalen.no', 'https://*.roisalen.pages.dev']);
    });

    test('defaults to local dev servers outside production', () => {
      expect(config.allowedOrigins()).toEqual([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ]);
    });

    test('throws in production when ALLOWED_ORIGINS is unset', () => {
      process.env.NODE_ENV = 'production';
      expect(() => config.allowedOrigins()).toThrow('ALLOWED_ORIGINS must be set in production');
    });

    test('uses ALLOWED_ORIGINS in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.ALLOWED_ORIGINS = 'https://roisalen.no';
      expect(config.allowedOrigins()).toEqual(['https://roisalen.no']);
    });
  });
});
