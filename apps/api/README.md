roisalen
========

roisalen is a simple app for managing large meetings. This package holds the node backend for roisalen.

## Run and test (from the repo root)

1. `npm ci`
2. `npm test` (Jest; starts a throwaway `mongod`, or uses `MONGO_TEST_URI` if set)

## Run the backend with Docker

`docker compose up` (from the repo root) brings up MongoDB 8.0 in one container and the API in another.

## Run the backend on your own machine

You need MongoDB running locally (or `docker compose up mongo`).

1. Copy `.env.example` to `.env` in this folder and adjust it (`MONGO_URI`, `PORT`, `ALLOWED_ORIGINS`, `ROISALEN_ADMIN_SECRET`).
2. `npm run dev -w @roisalen/api` (from the repo root)
