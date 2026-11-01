const { MongoClient } = require('mongodb');

async function withClient(fn) {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    return await fn(client.db());
  } finally {
    await client.close();
  }
}

function resetDatabase() {
  return withClient((db) => db.dropDatabase());
}

function serverVersion() {
  return withClient(async (db) => (await db.command({ buildInfo: 1 })).version);
}

module.exports = { resetDatabase, serverVersion };
