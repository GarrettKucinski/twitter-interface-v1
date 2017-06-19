"use strict";

const express = require('express');
const router = express.Router();
// const twit = require('../utils/tweets');
const apiCredentials = require('../config.js');
const Twit = require('twit');

const twit = new Twit(apiCredentials);
const timeSinceTweet = require('../utils/time-since-tweet');

/* GET home page. */
router.get('/', function(req, res, next) {
    Promise.all([
        twit.get('statuses/user_timeline', { screen_name: 'realgarrettk', count: 5 }),
        twit.get('friends/list', { screen_name: 'realgarrettk', count: 5 }),
        twit.get('users/show', { screen_name: 'realgarrettk' }),
        twit.get('direct_messages', { count: 5 })
    ]).then(results => {
        res.render('index', {
            timeline: results[0].data,
            friends: results[1].data,
            timeSinceTweet: timeSinceTweet,
            currentUser: results[2].data,
            incomingMessages: results[3].data
        });
    }).catch(error => {
        console.log(error.message);
    });
});

module.exports = router;