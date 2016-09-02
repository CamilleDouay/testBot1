'use strict';

// Wit.ai parameters

const WIT_TOKEN = process.env.WIT_TOKEN || '5NHOWL34ZPSCN6LVN3BCSVT5T3SMTE35';
if(!WIT_TOKEN) {
	throw new Error('missing WIT_TOKEN');
}

// Messenger API parameters

const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'verify_token';

module.exports = {
	WIT_TOKEN: WIT_TOKEN,
	FB_PAGE_TOKEN: FB_PAGE_TOKEN,
	FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
};

