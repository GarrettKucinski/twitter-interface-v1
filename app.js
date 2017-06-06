"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const getCredentials = require('./config');
const Twit = require('twit');

const index = require('./routes/index');

const app = express();

// Set up twit to access twitter api
const twit = new Twit({
    consumer_key: getCredentials.consumerKey,
    consumer_secret: getCredentials.consumerSecret,
    access_token: getCredentials.accessToken,
    access_token_secret: getCredentials.accessTokenSecret
});

twit.get('statuses/home_timeline', { screen_name: 'garrettdesigns' }, (error, data, response) => {
    console.log(response.statusCode);
}).then(results => {
    const timeline = results.data;
    console.log(timeline);
    app.set('timeline', timeline);
});

twit.get('friends/list', { screen_name: 'garrettdesigns' }, (error, data, response) => {
    console.log(response.statusCode);
}).then(results => {
    const friends = results.data;
    app.set('friends', friends);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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