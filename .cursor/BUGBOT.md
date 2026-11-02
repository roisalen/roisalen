# Review rules for Roisalen

Roisalen is a live speaker queue (talerliste) for meetings: `apps/api` (Express, MongoDB) and `apps/web` (React, Vite). Norwegian UI in Bokmål (`nb`) and Nynorsk (`nn`).

Flag these as bugs:

- **Secrets and personal data in the repo**: `.env` files, credentials, tokens, Mongo connection strings with passwords, database dumps (`*.bson`, `*.archive`, `mongodump` output), organisation exports (`organizations-export-*`), real names or member numbers in fixtures. Tests use obviously fake data.
- **i18n**: a user-visible string added to only one of `apps/web/src/i18n/nb.ts` / `nn.ts`, or hard-coded in a component.
- **CORS**: anything that weakens the `ALLOWED_ORIGINS` check in `apps/api/cors-allowlist.js` (unanchored or substring matching, `cors()` without the allowlist, `Access-Control-Allow-Origin: *`, reflecting an origin that wasn't checked first).
- **Organisation scoping**: API reads or writes to MongoDB that don't filter by the `X-organisation` header (`organisation` field / `_id` of the org). One org must never see another's data.
- **Speaker queue state** lives in process memory (`speaker-list-resource.js`). Flag code that assumes several instances, persistence across restarts, or that mutates queues outside that module.
- **Config**: new environment variables not read through `apps/api/config.js` and not documented in `apps/api/.env.example`; production code with fallback defaults for `MONGO_URI` or `ALLOWED_ORIGINS`.
- **Usage dashboard** (`/usage/summary`): logging of IP addresses, request bodies or speaker names; access without `ROISALEN_ADMIN_SECRET`.
- **Tests**: behaviour changes in `apps/api` without a Jest test, or user flows in `apps/web` changed without updating Vitest/Playwright tests.

Not bugs here: `var` and callback style in legacy API files; the 0-based month in statistics date URLs (the client sends it that way).
