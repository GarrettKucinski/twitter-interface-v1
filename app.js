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
// const twit = require('./utils/tweets');

const apiCredentials = require('./config.js');
const Twit = require('twit');

const twit = new Twit(apiCredentials);

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
        console.log('tweet data', data);
    });
    setTimeout(_ => {
        res.redirect('/');
    }, 300);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;