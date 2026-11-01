var crypto = require("crypto");
var ObjectId = require("mongodb").ObjectId;
var db = require("./db");

function organisations() {
	return db.getDb().collection('organisations');
}

function compare(orgA, orgB) {
	return orgA.name.localeCompare(orgB.name);
}

function validShortName(shortName) {
	return shortName && shortName.length > 2 && shortName.length < 12;
}

function validOrgName(orgName) {
	return orgName && orgName.length > 0;
}

function generateSlug() {
	// Generate a random 16-character alphanumeric string for obscure URLs
	return crypto.randomBytes(8).toString('hex');
}

function getOrganisations(req, res, next) {
	// Filter out hidden organizations for front-page display, unless includeHidden=true
	// Default behavior: treat missing hidden field as hidden=true (all existing orgs are hidden by default)
	var query = {};
	if (req.query.includeHidden !== 'true') {
		// Only show organizations that explicitly have hidden: false
		query.hidden = false;
	}
	organisations().find(query).toArray().then(function(success) {
		success.sort(compare);
		res.status(200).send(success);
		return next();
	}, function(err) {
		console.log(err)
		res.status(500).send();
		return next(err);
	});
}

function addOrganisation(req, res, next) {
	if (!validShortName(req.body.shortName) || !validOrgName(req.body.name)) {
		res.status(400).send();
		return next();
	}
	req.body._id = req.body.shortName;
	// Generate slug if not provided (for obscure URLs)
	if (!req.body.slug) {
		req.body.slug = generateSlug();
	}
	organisations().replaceOne({_id: req.body._id}, req.body, {upsert: true}).then(function() {
		res.status(201).send(req.body);
		return next();
	}, function(err) {
		console.log(err);
		res.status(500).send();
		return next(err);
	});
}

function deleteOrganisation(req, res, next) {
	var id = req.params.id;
	if (id.length > 12 && ObjectId.isValid(id)) {
		id = new ObjectId(id);
	}
	organisations().deleteMany({_id: id}).then(function() {
		console.log("deleted all");
		res.status(200).send();
		return next();
	}, function(err) {
		res.status(500).send();
		return next(err);
	});
}


module.exports.get = getOrganisations;
module.exports.add = addOrganisation;
module.exports.delete = deleteOrganisation;

