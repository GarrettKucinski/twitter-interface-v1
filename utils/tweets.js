const apiCredentials = require('../config.js');
const Twit = require('twit');

const twit = new Twit(apiCredentials);

module.exports = twit;