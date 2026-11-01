# Build from the repo root: docker build -f apps/api/Dockerfile -t roisalen-api .
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci --omit=dev --workspace=@roisalen/api --include-workspace-root=false

COPY apps/api apps/api

RUN chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 8080

USER node
WORKDIR /app/apps/api

CMD ["node", "server.js"]
