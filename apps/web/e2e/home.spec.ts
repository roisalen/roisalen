import { test, expect } from '@playwright/test';
import { installRestMocks } from './fixtures/api-mock';

test.beforeEach(async ({ page }) => {
  await installRestMocks(page);
});

test('home page shows organization from API', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('E2E Test Organization')).toBeVisible();
});

test('selecting organization navigates to speaker list', async ({ page }) => {
  await page.goto('/');
  await page.getByText('E2E Test Organization').click();
  await expect(page).toHaveURL(/\/e2eorg\/speaker-list/);
});
