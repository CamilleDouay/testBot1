var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();


// Get config 

const Config = require('./config.js');
const FB = require('./facebook.js');
const bot = require('./bot.js');

//const wit = require('./bot.js').getWit();


// Setting up our bot
const wit = bot.getWit();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));


// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
  var sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }; // set context, _fid_
  }
  return sessionId;
};


// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});


app.get('/webhook', function (req, res) {
	if(!Config.FB_VERIFY_TOKEN){
		throw new Error('missing FB_VERIFY_TOKEN')
	}
	if (req.query['hub.verify_token'] == config.FB_VERIFY_TOKEN){
		res.send(req.query['hub.challenge']);
	} else {
		res.sendStatus(400)
	}
});

// The main message handler
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
			const sender = event.sender.id; 
			console.log(sender);
			
			const msg = event.message.text;
			const atts = event.message.attachements;
			
			if(atts){
				FB.sendMessage(
				sender, 
				'Sorry, I can only porcesse text messages for now'
				);
			} else if (msg) {
				FB.sendMessage(sender, {text: "Echo: " + event.message.text});
			}
			
        }
    }
    res.sendStatus(200);
});