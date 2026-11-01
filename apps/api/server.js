var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var config = require('./config')
var corsAllowlist = require('./cors-allowlist').corsAllowlist

//Get app resources
var SpeakerListResource = require('./speaker-list-resource');
var SubjectResource = require('./subject-resource');
var MessageResource = require('./message-resource');
var RepresentativesResource = require('./representatives-resource');
var StatisticsResource = require('./statistics-resource');
var OrganisationResource = require('./organisation-resource');
var HealthResource = require('./health-resource');
var UsageResource = require('./usage-resource');

//Set server (skip listen in tests so Supertest can inject requests)
if (process.env.NODE_ENV !== 'test') {
	// Fail fast at boot when MONGO_URI is missing in production
	config.mongoUri()
	var server = app.listen(config.port(), function() {
		var host = server.address().address
		var port = server.address().port
		console.log('Listening at http://%s:%s', host, port)
	})
}

module.exports = app

//CORS allowlist (ALLOWED_ORIGINS) first, then bodyparser
app.use(corsAllowlist(config.allowedOrigins()))
app.use(bodyParser.json())

//Representatives endpoint
app.get('/representatives', RepresentativesResource.getAll)
app.get('/representatives/:speakerId', RepresentativesResource.get)
app.delete('/representatives/:speakerId', RepresentativesResource.delete)
app.delete('/representativesDeleteAll/IMSURE', RepresentativesResource.deleteAll)
app.post('/representatives', RepresentativesResource.add)

//Speakerlist endpoints
app.get('/speakerList', SpeakerListResource.getList)
app.post('/speakerList', SpeakerListResource.addSpeaker)
app.delete('/speakerList/:speakerRank', SpeakerListResource.removeSpeaker)
app.post('/speakerList/:speakerRank/replies', SpeakerListResource.addReply)
app.delete('/speakerList/:speakerRank/replies/:replyRank', SpeakerListResource.deleteReply);
app.post('/speakerList/:speakerRank', SpeakerListResource.nextSpeaker);
app.put('/speakerList/:oldPlace', SpeakerListResource.moveSpeaker);

//Subject endpoints
app.post('/subject', SubjectResource.set)
app.get('/subject', SubjectResource.get);

app.post('/message', MessageResource.set);
app.get('/message', MessageResource.get);

//Organisation endpoints
app.get('/organisations', OrganisationResource.get);
app.post('/organisations', OrganisationResource.add);
app.delete('/organisations/IMSURE/:id', OrganisationResource.delete);

//Statistics endpoints
app.get('/statistics/:field', StatisticsResource.getRankedListByField)
app.get('/statistics/:field/:fromDate', StatisticsResource.getRankedListByField)
app.get('/statistics/:field/:fromDate/:toDate', StatisticsResource.getRankedListByField)

//Healthcheck
app.get('/status', HealthResource.get);

// Usage dashboard (protected — see ROISALEN_ADMIN_SECRET)
app.get('/usage/summary', UsageResource.getSummary);
