var Twitter = require('node-tweet-stream'),
Deferred = require("promised-io/promise").Deferred,
winston = require('winston'),
request = require("http").request,
logger = new winston.Logger(),
async = require("async");

logger.add(winston.transports.Console);

var Tracker = function() {
	this.tracker = new Twitter({
	    consumer_key: process.env.TWITTER_CONSUMER_KEY,
	    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,,
	    token: process.env.TWITTER_TOKEN,
	    token_secret: process.env.TWITTER_SECRET
	});
};

Item.prototype.start = function() {
	tracker.on('tweet', function (tweet) {
  		console.log('tweet received', tweet)
	});
	tracker.on('error', function (err) {
  		console.log('Oh no')
	});
}

Item.prototype.add = function(hashtag) {
	tracker.track(hashtag);
}

Item.prototype.remove = function(hashtag) {
	tracker.untrack(hashtag);
}