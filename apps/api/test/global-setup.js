const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function globalSetup() {
  if (process.env.MONGO_TEST_URI) {
    process.env.MONGO_URI = process.env.MONGO_TEST_URI;
  } else {
    const mongod = await MongoMemoryServer.create();
    globalThis.__MONGOD__ = mongod;
    process.env.MONGO_URI = mongod.getUri('roisalen-test');
  }
  // Read by the pre-migration mongojs code; removed in Task 9
  process.env.MONGOLAB_URI = process.env.MONGO_URI;
};
