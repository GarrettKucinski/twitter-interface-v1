"use strict";

module.exports = (timestamp) => {
    const currentTime = new Date();
    const twitTime = new Date(timestamp);
    let timeSinceTweet = '';

    const milliseconds = (currentTime.getTime() - twitTime.getTime());
    const seconds = (milliseconds / 1000);
    const minutes = (seconds / 60);
    const hours = (minutes / 60);

    switch (true) {
        case seconds < 60:
            timeSinceTweet = `${Math.round(seconds)}s`;
            break;

        case minutes < 60:
            timeSinceTweet = `${Math.round(minutes)}m`;
            break;

        case hours < 24:
            timeSinceTweet = `${Math.round(hours)}h`;
            break;
        default:
            timeSinceTweet = twitTime.toDateString().slice(4, 10);
            break;
    }

    return `${timeSinceTweet}`;
};