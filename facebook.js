'use strict'

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

const fbMessage = (recipientId, msg, cb){
	const opts = {
		form:{
			recipient:{
				id: recipientId,
			},
			message: {
				text: msq,
			},
		},
	};
	
	
}