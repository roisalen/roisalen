var db = require("./db");

function getStatus(req, res, next) {
	db.getDb().command({ping: 1}).then(function (success) {
		if (success.ok) {
			res.status(200).send("db is ok :)\n");
			return next();
		}
		res.status(503).send("db is not ok :(\n");
		return next();
	}, function (err) {
		res.status(503).send("db is not ok :(\n");
		return next(err);
	});
}

module.exports.get = getStatus;
