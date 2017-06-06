const getCredentials = require('../config.js');
const Twit = require('twit');

// Set up twit to access twitter api
const twit = new Twit(getCredentials);

const timeline = twit.get('statuses/home_timeline', { screen_name: 'garrettdesigns', count: 5 });

const friends = twit.get('friends/list', { screen_name: 'garrettdesigns', count: 5 });

console.log(timeline);
console.log(friends);


module.exports.friends = friends;
module.exports.timeline = timeline;