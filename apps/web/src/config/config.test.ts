import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('resolveApiUrl (config)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses VITE_API_URL when set', async () => {
    vi.stubEnv('VITE_API_URL', 'http://127.0.0.1:18080');
    const { default: cfg } = await import('./config');
    expect(cfg.apiUrl).toBe('http://127.0.0.1:18080');
  });

  it('strips trailing slash from VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:8080/');
    const { default: cfg } = await import('./config');
    expect(cfg.apiUrl).toBe('http://localhost:8080');
  });
});
