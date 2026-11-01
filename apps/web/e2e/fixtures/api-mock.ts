import type { Page } from '@playwright/test';

/** Must match `VITE_API_URL` in Playwright webServer (no trailing slash). */
export const E2E_MOCK_API_ORIGIN = 'http://127.0.0.1:18080';

function corsJsonHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };
}

/**
 * Intercept all REST calls so E2E runs without a real MongoDB or node-server.
 * Extend handlers as you add flows (speaker list, lead meeting, etc.).
 */
export async function installRestMocks(page: Page): Promise<void> {
  const prefix = `${E2E_MOCK_API_ORIGIN}/`;

  await page.route(`${prefix}**`, async (route) => {
    const req = route.request();
    const method = req.method();
    const url = req.url();

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsJsonHeaders() });
      return;
    }

    if (url.includes('/organisations')) {
      await route.fulfill({
        status: 200,
        headers: corsJsonHeaders(),
        body: JSON.stringify([
          {
            _id: 'e2eorg',
            name: 'E2E Test Organization',
            shortName: 'e2eorg',
            hidden: false,
          },
        ]),
      });
      return;
    }

    if (url.includes('/usage/summary')) {
      await route.fulfill({
        status: 200,
        headers: corsJsonHeaders(),
        body: JSON.stringify({
          generatedAt: new Date().toISOString(),
          activeMeetings: [
            {
              organisation: 'e2eorg',
              organisationName: 'E2E Test Organization',
              queueLength: 2,
              currentSpeakerLabel: 'Mock Speaker',
            },
          ],
          recentMeetingsLast30Days: [
            {
              organisation: 'e2eorg',
              organisationName: 'E2E Test Organization',
              eventCount: 5,
              lastActivity: new Date().toISOString(),
              firstActivityInPeriod: new Date().toISOString(),
            },
          ],
        }),
      });
      return;
    }

    if (url.includes('/speakerList')) {
      await route.fulfill({
        status: 200,
        headers: corsJsonHeaders(),
        body: JSON.stringify([]),
      });
      return;
    }

    if (url.includes('/subject')) {
      await route.fulfill({
        status: 200,
        headers: { ...corsJsonHeaders(), 'Content-Type': 'text/plain' },
        body: '',
      });
      return;
    }

    if (url.includes('/message')) {
      await route.fulfill({
        status: 200,
        headers: { ...corsJsonHeaders(), 'Content-Type': 'text/plain' },
        body: '',
      });
      return;
    }

    if (url.includes('/representatives')) {
      await route.fulfill({
        status: 200,
        headers: corsJsonHeaders(),
        body: JSON.stringify([]),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      headers: corsJsonHeaders(),
      body: method === 'GET' ? '[]' : '{}',
    });
  });
}
