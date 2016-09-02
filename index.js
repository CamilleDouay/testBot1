var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();


// Get config 

const Config = require('./config.js');
const FB = require('./facebook.js');

//const wit = require('./bot.js').getWit();

console.log(Config.FB_VERIFY_TOKEN)
console.log(Config.WIT_TOKEN)

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
app.post('/webhook', function(req, res){
  // Parsing the Messenger API response
  const messaging = FB.getFirstMessagingEntry(req.body);
  if (messaging && messaging.message) {

    // Yay! We got a new message!

    // We retrieve the Facebook user ID of the sender
    const sender = messaging.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    const sessionId = findOrCreateSession(sender);

    // We retrieve the message content
    const msg = messaging.message.text;
    const atts = messaging.message.attachments;

    if (atts) {
      // We received an attachment

      // Let's reply with an automatic message
      FB.fbMessage(
        sender,
        'Sorry I can only process text messages for now.'
      );
    } else if (msg) {
      // We received a text message

      // Let's forward the message to the Wit.ai Bot Engine
      // This will run all actions until our bot has nothing left to do
      FB.fbmessage(
	  sender, 
	  'Je n\'ai pas d\'autres réponses pour le moment'
	  );
    }
  }
  res.sendStatus(200);
});
