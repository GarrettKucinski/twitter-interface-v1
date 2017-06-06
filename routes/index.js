const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const date = new Date();
    const currentTime = date.toTimeString();
    const friends = req.app.get('friends');
    const timeline = req.app.get('timeline');
    res.render('index', { friends: friends, timeline: timeline, currentTime: currentTime });
});

module.exports = router;