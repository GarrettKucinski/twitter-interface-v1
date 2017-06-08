const express = require('express');
const router = express.Router();
const twit = require('../utils/tweets');
const timeSinceTweet = require('../utils/time-since-tweet');

/* GET home page. */
router.get('/', function(req, res, next) {
    twit.timeline.then((results) => {
        let timeline = results.data;
        twit.friends.then((results) => {
            let friends = results.data;
            twit.currentUser.then((results) => {
                let currentUser = results.data;
                twit.direct_messages.then((results) => {
                    let direct_messages = results.data;
                    console.log(direct_messages.events);
                    res.render('index', { friends: friends, timeline: timeline, timeSinceTweet: timeSinceTweet, currentUser: currentUser, direct_messages: direct_messages });
                });
            });
        });
    });
});

module.exports = router;