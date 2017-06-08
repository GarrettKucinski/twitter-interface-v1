"use strict";

/**
 * Function to calculate length of time that has passed since a tweet was posted 
 * This takes in a time stamp as a string and converts it into a new date object.
 * 
 * From the timestamp it calculates the length of time since the tweet and the function
 * call (current time) and returns it.
 * 
 * @param {any} timestamp 
 * @returns String 
 */

module.exports = (timestamp, directMessage = false) => {
    const currentTime = new Date();
    const twitTime = new Date(timestamp);
    let timeSinceTweet = '';

    const milliseconds = (currentTime.getTime() - twitTime.getTime());
    const seconds = (milliseconds / 1000);
    const minutes = (seconds / 60);
    const hours = (minutes / 60);

    switch (true) {
        case seconds < 60:
            timeSinceTweet = `${Math.round(seconds)}${directMessage ? ' seconds ago' : 's'}`;
            break;

        case minutes < 60:
            timeSinceTweet = `${Math.round(minutes)}${directMessage ? ' minutes ago ' : 'm'}`;
            break;

        case hours < 24:
            timeSinceTweet = `${Math.round(hours)}${directMessage ? ' hours ago' : 'h'}`;
            break;
        default:
            timeSinceTweet = twitTime.toDateString().slice(4, 10);
            break;
    }

    return `${timeSinceTweet}`;
};