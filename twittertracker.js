var Twitter = require('node-tweet-stream'),
request = require("http").request,
async = require("async")
EventEmitter = require("events");

var Tracker = function() {
	this.tracker = new Twitter({
	    consumer_key: process.env.TWITTER_CONSUMER_KEY,
	    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	    token: process.env.TWITTER_TOKEN,
	    token_secret: process.env.TWITTER_SECRET
	});
};

Tracker.prototype.start = function() {
	var ee = new EventEmitter();
	this.tracker.on('tweet', function (tweet) {
  		var hashtags=[];
  		for (var i = tweet.entities.hashtags.length - 1; i >= 0; i--) {
  			hashtags.push(tweet.entities.hashtags[i].text);
  		};
  		var users=[];
  		 for (var i = tweet.entities.user_mentions.length - 1; i >= 0; i--) {
  			users.push(tweet.entities.user_mentions[i].screen_name);
  		};
  		var tweet_data={
  			author:tweet.user.screen_name,
  			mentions:{
  				hashtags:hashtags,
  				users:users
  			}
  		}
  		console.log(JSON.stringify(tweet_data));
  		ee.emit("tweet",tweet_data);
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