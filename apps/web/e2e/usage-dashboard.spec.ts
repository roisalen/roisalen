import { test, expect } from '@playwright/test';
import { installRestMocks } from './fixtures/api-mock';

test.beforeEach(async ({ page }) => {
  await installRestMocks(page);
});

test('usage dashboard loads and fetches summary with secret', async ({ page }) => {
  await page.goto('/usage');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByLabel(/Admin-nøkkel|Admin/i).fill('playwright-test-secret');
  await page.getByRole('button', { name: /Hent data|Load/i }).click();

  await expect(page.getByText('E2E Test Organization').first()).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByText('Mock Speaker')).toBeVisible();
});
