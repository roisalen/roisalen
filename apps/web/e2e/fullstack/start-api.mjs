// Starts the real API for the full-stack Playwright suite.
// MONGO_URI set: use it (CI passes the mongo service container). Unset: start a throwaway mongod.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const apiDir = fileURLToPath(new URL('../../../api/', import.meta.url));

let mongod = null;
let mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  // Same mongod version as the API's Jest setup, so the downloaded binary is shared.
  const apiPackage = JSON.parse(readFileSync(`${apiDir}package.json`, 'utf8'));
  mongod = await MongoMemoryServer.create({
    binary: { version: apiPackage.config.mongodbMemoryServer.version },
  });
  mongoUri = mongod.getUri('roisalen-e2e');
}

const api = spawn(process.execPath, ['server.js'], {
  cwd: apiDir,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development', MONGO_URI: mongoUri },
});

let stopping = false;
async function stop(code) {
  if (stopping) return;
  stopping = true;
  api.kill('SIGTERM');
  if (mongod) await mongod.stop();
  process.exit(code);
}

api.on('exit', (code) => stop(code ?? 1));
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
