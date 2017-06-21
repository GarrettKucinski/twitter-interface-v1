"use strict";

// REQUIRE ALL PACKAGES NEEDED FOR THE APP
// ========================================
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const twit = require('./utils/tweets');

const index = require('./routes/index');

const app = express();

// VIEW ENGINE SETUP
// ========================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// CONFIGURE APPLICATION
// ========================================
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, '/scss'),
    dest: path.join(__dirname, '/public/stylesheets'),
    indentedSyntax: false,
    sourceMap: true,
    outputStyle: 'compressed',
    prefix: '/static/stylesheets'
}));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.post('/', (req, res) => {
    twit.post('statuses/update', { status: req.body.tweetContent }, (error, data) => {
        res.redirect('/');
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('We\'re sorry, it seems that page was not found.');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    twit.get('account/verify_credentials').then(results => {
        const userData = results.data;
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
                currentUser: userData.screen_name,
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


module.exports = app;