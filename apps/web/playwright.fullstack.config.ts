import { defineConfig, devices } from '@playwright/test';
import {
  E2E_ADMIN_SECRET,
  E2E_API_ORIGIN,
  E2E_API_PORT,
  E2E_WEB_ORIGIN,
  E2E_WEB_PORT,
} from './e2e/fullstack/env';

/**
 * Browser tests against the real API and a real MongoDB.
 * Uses MONGO_URI when set (CI: mongo service container), otherwise starts a throwaway mongod.
 */
export default defineConfig({
  testDir: './e2e/fullstack',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-fullstack' }]],
  outputDir: 'test-results-fullstack',
  use: {
    baseURL: E2E_WEB_ORIGIN,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node e2e/fullstack/start-api.mjs',
      url: `${E2E_API_ORIGIN}/status`,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: 'pipe',
      env: {
        PORT: String(E2E_API_PORT),
        ALLOWED_ORIGINS: E2E_WEB_ORIGIN,
        ROISALEN_ADMIN_SECRET: E2E_ADMIN_SECRET,
      },
    },
    {
      command: `VITE_API_URL=${E2E_API_ORIGIN} npm run dev -- --host 127.0.0.1 --port ${E2E_WEB_PORT} --strictPort`,
      url: E2E_WEB_ORIGIN,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
