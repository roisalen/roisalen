/** Ports differ from the mocked suite (5173 / 18080) so both suites can run side by side. */
export const E2E_API_PORT = 18090;
export const E2E_WEB_PORT = 5174;
export const E2E_API_ORIGIN = `http://127.0.0.1:${E2E_API_PORT}`;
export const E2E_WEB_ORIGIN = `http://127.0.0.1:${E2E_WEB_PORT}`;
/** Throwaway value; never a real secret. */
export const E2E_ADMIN_SECRET = 'playwright-fullstack-admin-secret';
