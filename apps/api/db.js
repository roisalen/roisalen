var MongoClient = require('mongodb').MongoClient;
var config = require('./config');

var client = null;

function getDb() {
	if (!client) {
		// Keeps /status from hanging for the 30 s default when the DB is unreachable
		client = new MongoClient(config.mongoUri(), { serverSelectionTimeoutMS: 5000 });
	}
	return client.db();
}

function close() {
	if (!client) {
		return Promise.resolve();
	}
	var closing = client;
	client = null;
	return closing.close();
}

module.exports.getDb = getDb;
module.exports.close = close;
