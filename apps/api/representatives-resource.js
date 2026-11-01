var Speaker = require("./models/speaker");
var db = require("./db");

function representatives(organisation) {
	return db.getDb().collection(organisation + "-representatives");
}

function getSpeakerFromDB(organisation, speakerId, callBack) {
	representatives(organisation).findOne({number: speakerId}).then(function(speaker) {
		return callBack(speaker || false);
	}, function() {
		return callBack(false);
	});
}


module.exports.getSpeakerFromDB = getSpeakerFromDB;

module.exports.getAll = function(req, res, next) {
	representatives(req.header('X-organisation')).find().sort({number: 1}).toArray().then(function(success) {
		res.status(200).send(success);
	}, function(err) {
		res.status(500).send();
		return next(err);
	});
};

module.exports.get = function(req, res, next) {
	getSpeakerFromDB(req.header('X-organisation'), parseInt(req.params.speakerId), function(speaker) {
		if (speaker) {
			res.status(200).send(speaker);
			return next();
		} else {
			res.status(500).send();
			return next();
		}
	});
};

module.exports.delete = function(req, res, next) {
	representatives(req.header('X-organisation')).deleteMany({number: parseInt(req.params.speakerId)}).then(function() {
		res.status(200).send();
		return next();
	}, function(err) {
		res.status(500).send();
		return next(err);
	});
}

module.exports.deleteAll = function(req, res, next) {
	representatives(req.header('X-organisation')).deleteMany({}).then(function() {
		console.log("deleted all");
		res.status(200).send();
		return next();
	}, function(err) {
		res.status(500).send();
		return next(err);
	});
}


module.exports.add = function(req, res, next) {
	var speakerJson = req.body;
	var speakerNumber = parseInt(speakerJson.number);

	if (isNaN(speakerNumber)) {
		res.status(400).send("Speaker number must be a number");
		return next();
	}

	var speaker = new Speaker(speakerJson.name, speakerNumber, speakerJson.sex, speakerJson.group);

	representatives(req.header('X-organisation')).replaceOne({_id: speaker._id}, speaker, {upsert: true}).then(function() {
		res.status(201).send(speaker);
		return next();
	}, function(err) {
		res.status(500).send();
		return next(err);
	});
}
