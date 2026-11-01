import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('OrganizationService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_API_URL', 'http://mock.api');
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => [
        { _id: 'a', name: 'Alpha Org', shortName: 'alpha', hidden: false },
      ],
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('GET /organisations returns parsed list', async () => {
    const { organizationService } = await import('./OrganizationService');
    const list = await organizationService.getOrganizations();
    expect(list).toHaveLength(1);
    expect(list[0].shortName).toBe('alpha');
    expect(fetch).toHaveBeenCalledWith('http://mock.api/organisations', expect.any(Object));
  });
});
