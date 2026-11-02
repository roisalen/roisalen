import { test, expect, type APIRequestContext } from '@playwright/test';
import { E2E_ADMIN_SECRET, E2E_API_ORIGIN } from './env';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('preferredLanguage', 'nb'));
});

function uniqueShortName(): string {
  return `e2e${Date.now().toString(36).slice(-6)}`;
}

async function queueSpeaker(
  request: APIRequestContext,
  shortName: string,
  speaker: { name: string; number: string; group: string },
): Promise<void> {
  const headers = { 'X-organisation': shortName };
  const added = await request.post(`${E2E_API_ORIGIN}/representatives`, {
    headers,
    data: { ...speaker, sex: 'female' },
  });
  expect(added.status()).toBe(201);
  const queued = await request.post(`${E2E_API_ORIGIN}/speakerList`, {
    headers,
    data: { speakerNumber: Number(speaker.number) },
  });
  expect(queued.status()).toBe(200);
}

test('new organisation is saved, listed, and shows its live speaker list', async ({ page, request }) => {
  const shortName = uniqueShortName();
  const name = `E2E Fullstack ${shortName}`;

  await page.goto('/add-organisation');
  await page.getByLabel('Organisasjonsnavn').fill(name);
  await page.getByLabel('Kort navn', { exact: true }).fill(shortName);
  await page.getByRole('button', { name: 'Lagre' }).click();

  await expect(page).toHaveURL(/\/speaker-list$/);
  await expect(page.getByText('Ingen talere på listen')).toBeVisible();

  await queueSpeaker(request, shortName, { name: 'Kari Nordmann', number: '7', group: 'Gruppe A' });
  await expect(page.getByRole('cell', { name: 'Kari Nordmann' })).toBeVisible({ timeout: 10_000 });

  await page.goto('/');
  await expect(page.getByText(name)).toBeVisible();
});

test('usage dashboard reads live queues from the API', async ({ page, request }) => {
  const shortName = uniqueShortName();
  const created = await request.post(`${E2E_API_ORIGIN}/organisations`, {
    data: { name: `E2E Usage ${shortName}`, shortName, hidden: false },
  });
  expect(created.status()).toBe(201);
  await queueSpeaker(request, shortName, { name: 'Ola Nordmann', number: '3', group: 'Gruppe B' });

  await page.goto('/usage');
  await page.getByLabel(/Admin-nøkkel|Admin/i).fill(E2E_ADMIN_SECRET);
  await page.getByRole('button', { name: /Hent data|Load/i }).click();

  await expect(page.getByText(`E2E Usage ${shortName}`).first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Ola Nordmann')).toBeVisible();
});
