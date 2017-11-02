const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const
   express = require('express'),
   bodyParser = require('body-parser'),
   app = express().use(bodyParser.json());

app.post('/webhook', (req, res) => {
	let body = req.body;

	if (body.object === 'page') {
		body.entry.forEach(entry => {
			let webhookEvent = entry.messaging[0];
			console.log(webhookEvent);
		});
		res.status(200).send('EVENT_RECIEVED');
	} else {
		res.sendStatus(404);
	}
});

app.get('/webhook', (req,res) => {
	//todo: replace verify token
	let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>";

	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	if (mode && token) {
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);
		}
	}
});

exports.bot = functions.https.onRequest(app);

