var DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/roisalen';
var DEFAULT_PORT = 8080;
var DEV_ALLOWED_ORIGINS = [
	'http://localhost:3000',
	'http://127.0.0.1:3000',
	'http://localhost:5173',
	'http://127.0.0.1:5173'
];

function isProduction() {
	return process.env.NODE_ENV === 'production';
}

function mongoUri() {
	var uri = process.env.MONGO_URI;
	if (uri && uri.trim()) {
		return uri.trim();
	}
	if (isProduction()) {
		throw new Error('MONGO_URI must be set in production');
	}
	return DEFAULT_MONGO_URI;
}

function port() {
	var parsed = parseInt(process.env.PORT, 10);
	return isNaN(parsed) ? DEFAULT_PORT : parsed;
}

function allowedOrigins() {
	var raw = process.env.ALLOWED_ORIGINS;
	if (raw && raw.trim()) {
		return raw.split(',').map(function (origin) {
			return origin.trim().replace(/\/$/, '');
		}).filter(Boolean);
	}
	if (isProduction()) {
		throw new Error('ALLOWED_ORIGINS must be set in production');
	}
	return DEV_ALLOWED_ORIGINS.slice();
}

module.exports.mongoUri = mongoUri;
module.exports.port = port;
module.exports.allowedOrigins = allowedOrigins;
