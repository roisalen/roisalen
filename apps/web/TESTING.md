# Testing (TDD)

## Unit / component tests (Vitest)

- **Location:** `src/**/*.test.ts` / `*.test.tsx` next to the code under test.
- **Run:** `npm test` · watch: `npm run test:watch`
- **Coverage:** `npm run test:coverage` (opens `text` + `lcov` for CI)

Use **Red → Green → Refactor:** add or change a test in the same module before production code.

## End-to-end (Playwright)

- **Location:** `e2e/*.spec.ts`
- **API:** Requests go to `VITE_API_URL=http://127.0.0.1:18080` (no real server).  
  Handlers are in `e2e/fixtures/api-mock.ts` — extend when you add user journeys.
- **Install browsers (once per machine):** `npm run test:e2e:install`
- **Run:** `npm run test:e2e` · UI mode: `npm run test:e2e:ui`

### Full stack locally

To hit a real `node-server` + MongoDB instead of mocks, start the API on port 8080 and run:

```bash
VITE_API_URL=http://127.0.0.1:8080 npm run dev
```

Then point Playwright `baseURL` / webServer at that dev server and remove or narrow `installRestMocks` for those specs.

## CI

GitHub Actions runs lint, Vitest, build, and Playwright (Chromium) on push/PR.

## Dependencies and `npm ci` warnings

- **Dependabot** (`.github/dependabot.yml`) opens weekly PRs to keep direct dependencies current; merge or adjust groups as you like.
- **Remaining `npm warn deprecated` lines** are almost always **transitive** (a dependency of a dependency). Common cases here:
  - **Frontend:** `glob` via `@vitest/coverage-v8` → `test-exclude`; `whatwg-encoding` via `jsdom`. They clear when those packages release updates—no safe local override without risk.
  - **Backend:** `glob` / `inflight` via **Jest**; old **bson** via **mongojs** / **mongodb@3**. A durable fix for bson is to **migrate off `mongojs`** to the official `mongodb` driver (larger refactor).
- **`engines.node`** in `package.json` matches what ESLint 9 expects so you avoid `EBADENGINE` on supported Node versions (use **Node ≥ 22.13** or **≥ 20.19** locally and in CI).
