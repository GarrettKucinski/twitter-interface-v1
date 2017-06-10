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
                console.log(currentUser);
                twit.incomingMessages.then((results) => {
                    let incomingMessages = results.data;
                    twit.outgoingMessages.then((results) => {
                        let outgoingMessages = results.data;
                        res.render('index', {
                            friends: friends,
                            timeline: timeline,
                            timeSinceTweet: timeSinceTweet,
                            currentUser: currentUser,
                            incomingMessages: incomingMessages,
                            outgoingMessages: outgoingMessages
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;