"use strict";

const express = require('express');
const router = express.Router();
const apiCredentials = require('../config.js');
const Twit = require('twit');
const app = require('../app');

const twit = new Twit(apiCredentials);

/* GET home page. */
router.get('/error', function(err, req, res, next) {
    twit.get('users/show', { screen_name: 'realgarrettk' }).then(results => {
        // error handler
        // render the error page
        res.status(err.status || 500);

        if (res.statusCode !== 404) {
            res.locals.message = 'Sorry! Your tweets could not be retrieved, please check back later';
        } else {
            res.locals.message = err.message;
        }

        if (app.get('env') === 'development') {
            res.render('error', {
                currentUser: results.data,
                status: res.statusCode,
                error: err
            });
        } else {
            res.render('error', {
                currentUser: results.data,
                status: res.statusCode,
                error: {}
            });
        }
    }).catch(error => {
        console.log(error.message);
    });
});

module.exports = router;