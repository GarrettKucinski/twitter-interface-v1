"use strict";

const express = require('express');
const router = express.Router();
const twit = require('../utils/tweets');
const timeSinceTweet = require('../utils/time-since-tweet');

/* GET home page. */
router.get('/', function(req, res, next) {
    twit.get('account/verify_credentials').then(results => {
        const userData = results.data;
        Promise.all([
            twit.get('statuses/user_timeline', { screen_name: userData.screen_name, count: 5 }),
            twit.get('friends/list', { screen_name: userData.screen_name, count: 5 }),
            twit.get('users/show', { screen_name: userData.screen_name }),
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

})
module.exports = router;