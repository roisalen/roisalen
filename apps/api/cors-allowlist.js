var cors = require('cors');

function patternToRegExp(pattern) {
	var escaped = pattern.replace(/\/$/, '').replace(/[.+?^${}()|[\]\\]/g, '\\$&');
	return new RegExp('^' + escaped.replace(/\*/g, '[a-z0-9-]+') + '$', 'i');
}

function isOriginAllowed(origin, patterns) {
	return patterns.some(function (pattern) {
		return patternToRegExp(pattern).test(origin);
	});
}

function corsAllowlist(patterns) {
	var reflectOrigin = cors({ origin: true });
	return function (req, res, next) {
		var origin = req.header('Origin');
		if (origin && !isOriginAllowed(origin, patterns)) {
			res.status(403).json({ error: 'Origin not allowed' });
			return;
		}
		reflectOrigin(req, res, next);
	};
}

module.exports.isOriginAllowed = isOriginAllowed;
module.exports.corsAllowlist = corsAllowlist;
