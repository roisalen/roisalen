# Roisalen

Live speaker queue for meetings (talerliste). Norwegian (nb/nn) web app.

| Path | What |
|---|---|
| `apps/api` | Express REST API, MongoDB (history from `roisalen/node-server`) |
| `apps/web` | React + Vite SPA (history from `roisalen/roisalen-frontend`) |

Design, phases and ops docs: [roisalen-server](https://github.com/roisalen/roisalen-server) (`docs/superpowers/specs/`).

## Requirements

Node 24 (`nvm use`). npm enforces it (`engine-strict`).

## Commands (repo root)

```bash
npm ci
npm run lint
npm test          # API (Jest, starts a throwaway mongod) + web (Vitest)
npm run test:e2e  # Playwright against a mocked API
npm run test:e2e:fullstack  # Playwright against the real API + MongoDB (throwaway mongod, or MONGO_URI)
npm run build     # web production build in apps/web/dist
```

The e2e suites need the browser first: `npm exec -w @roisalen/web -- playwright install chromium`.

Run the API locally: copy `apps/api/.env.example` to `apps/api/.env`, start MongoDB (`docker compose up mongo`), then `npm run dev -w @roisalen/api`.
Run the web app against it: `VITE_API_URL=http://localhost:8080 npm run dev -w @roisalen/web`.

## CI and merging

Every PR runs `.github/workflows/ci.yml`: lint, API tests (MongoDB 8.0), web tests + build, Playwright (mocked API and real API + MongoDB), Docker build + smoke test. `main` requires the **CI OK** check (ruleset: `.github/rulesets/main.json`); merge with **Create a merge commit**. Bugbot reviews each PR once (`.cursor/config/bugbot.yaml`, rules in `.cursor/BUGBOT.md`). Dependabot opens grouped PRs on Mondays.

## Production status

Production still runs from the old repos (`roisalen/node-server`, `roisalen/roisalen-frontend`, branch `master`) on the droplet until the Phase 5 cutover. Those repos are frozen: hotfixes only, then ported here.

## Rules

Never commit database data, dumps, organisation exports or secrets.
