const getCredentials = require('../config.js');
const Twit = require('twit');

// Set up twit to access twitter api
const twit = new Twit(getCredentials);
const timeline = twit.get('statuses/user_timeline', { screen_name: 'realgarrettk', count: 5 });
const friends = twit.get('friends/list', { screen_name: 'realgarrettk', count: 5 });
const direct_messages = twit.get('direct_messages/events/list', { count: 5 });
const currentUser = twit.get('users/show', { screen_name: 'realgarrettk' });

module.exports.friends = friends;
module.exports.timeline = timeline;
module.exports.currentUser = currentUser;
module.exports.direct_messages = direct_messages;