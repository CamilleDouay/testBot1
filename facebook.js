'use strict';

const request = require('request');
const Config = require('./config.js');


// handling facebook message 
const fbReq = request.defaults({
	uri: 'https://graph/facebook.com/me/messages', 
	method: 'POST',
	json: 'true',
	qs: {
		access_token: Config.FB_ACCESS_TOKEN
	},
	headers: {
		'Content-Type': 'application/json'
	},
});

const fbMessage = (recipientId, msg, cb) => {
	const opts = {
		form:{
			recipient:{
				id: recipientId,
			},
			message: {
				text: msg,
			},
		},
	};
	
	fbReq(opts, (err, resp, data) => {
		if (cb) {
			cb(err || data.error && data.error.message, data);
		}
	});
	
};

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: Config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// See the Webhook reference
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
const getFirstMessagingEntry = (body) => {
  const val = body.object === 'page' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].messaging &&
    Array.isArray(body.entry[0].messaging) &&
    body.entry[0].messaging.length > 0 &&
    body.entry[0].messaging[0];

  return val || null;
};



module.exports = {
  getFirstMessagingEntry: getFirstMessagingEntry,
  fbMessage: fbMessage,
  fbReq: fbReq,
  sendMessage: sendMessage
};