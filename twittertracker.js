var Twitter = require('node-tweet-stream'),
request = require("http").request,
async = require("async");

var Tracker = function() {
	this.tracker = new Twitter({
	    consumer_key: process.env.TWITTER_CONSUMER_KEY,
	    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	    token: process.env.TWITTER_TOKEN,
	    token_secret: process.env.TWITTER_SECRET
	});
};

Tracker.prototype.start = function() {
	this.tracker.on('tweet', function (tweet) {
  		console.log('tweet received', tweet)

  		//TODO:Increment count
  		//TODO:Parse hashtags
  		//TODO:Parse users
  		//Probably implement this by sending an event w/ vital tweet info: hashtag, author, mentions.
	});
	this.tracker.on('error', function (err) {
  		console.log('Oh no')
	});
}

Tracker.prototype.add = function(hashtag) {
	this.tracker.track(hashtag);
}

Tracker.prototype.remove = function(hashtag) {
	this.tracker.untrack(hashtag);
}

var t = new Tracker();
t.add("#obama");
t.start();