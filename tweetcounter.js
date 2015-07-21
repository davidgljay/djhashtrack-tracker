var EventEmitter = require("events"),
Firebase = require('firebase'),
_=require('underscore');

var Counter = function(ee) {
	var self=this;
	self.tracked_hashtags={};
	self.ee = ee;
	self.ee.on('tweet', function(tweet_data) {

		for (var i = tweet_data.mentions.hashtags.length - 1; i >= 0; i--) {
			if (self.tracked_hashtags[tweet_data.mentions.hashtags[i]]) {
				var hashtag = tweet_data.mentions.hashtags[i];


				//Write tests
				//Incremend the index;
				self.tracked_hashtags[hashtag].count += 1;

				//Increment the hashtag mentions
				for (var j = tweet_data.mentions.hashtags.length - 1; j >= 0; j--) {
					var mentioned_hashtag = tweet_data.mentions.hashtags[j];
					if (self.tracked_hashtags[hashtag].mentions.hashtags[mentioned_hashtag]) {
						self.tracked_hashtags[hashtag].mentions.hashtags[mentioned_hashtag] += 1;
					} else if (mentioned_hashtag != hashtag) {
						self.tracked_hashtags[hashtag].mentions.hashtags[mentioned_hashtag] = 1;
					}
				};

				//Increment the authors
				if (self.tracked_hashtags[hashtag].authors[tweet_data.author]) {
					self.tracked_hashtags[hashtag].authors[tweet_data.author] += 1;
				} else {
					self.tracked_hashtags[hashtag].authors[tweet_data.author] = 1;
				}

				//Increment the user mentions
				for (var j = tweet_data.mentions.users.length - 1; j >= 0; j--) {
					var mentioned_user = tweet_data.mentions.users[j];
					if (self.tracked_hashtags[hashtag].mentions.users[mentioned_user]) {
						self.tracked_hashtags[hashtag].mentions.users[mentioned_user] += 1;
					} else {
						self.tracked_hashtags[hashtag].mentions.users[mentioned_user] = 1;
					}
				};
			};

		};
	})
}

Counter.prototype.add = function(hashtag) {
	this.tracked_hashtags[hashtag] = {
		count:0,
		mentions: {
			hashtags: {},
			users: {}
		},
		authors:{}
	};
};

Counter.prototype.remove = function(hashtag) {
	//TODO:splice tracked_hashtags array to remove hashtag
}

module.exports = Counter;