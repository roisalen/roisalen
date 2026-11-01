interface Config {
  apiUrl: string;
}

/**
 * API base URL (no trailing slash).
 * - `VITE_API_URL`: override for local full-stack or Playwright E2E (see e2e/fixtures).
 * - Production: same host as the SPA with `/rest` path.
 * - Localhost default: public API at roisalen.no (unchanged for day-to-day dev).
 */
function resolveApiUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (fromEnv?.trim()) {
    return fromEnv.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.protocol}//${window.location.hostname}/rest`;
  }
  return 'https://roisalen.no/rest';
}

const config: Config = {
  get apiUrl() {
    return resolveApiUrl();
  },
};

export default config;
