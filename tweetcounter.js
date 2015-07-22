var EventEmitter = require("events"),
Firebase = require('firebase');

var Counter = function(ee) {
	var self=this;
	self.tracked_hashtags={};
	self.ee = ee;

	self.parseTweet = function(tweet_data) {
		for (var i = tweet_data.mentions.hashtags.length - 1; i >= 0; i--) {
			if (self.tracked_hashtags[tweet_data.mentions.hashtags[i]]) {
				var hashtag = tweet_data.mentions.hashtags[i];

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
	}
	self.ee.on('tweet', self.parseTweet);
}

Counter.prototype.blankHashTag = function() {
	return {
		count:0,
		mentions: {
			hashtags: {},
			users: {}
		},
		authors:{}
	}
}

Counter.prototype.add = function(hashtag) {
	var self=this;
	self.tracked_hashtags[hashtag] = self.blankHashTag();
};

Counter.prototype.remove = function(hashtag) {
	var self = this;
	delete self.tracked_hashtags[hashtag]
}

Counter.prototype.clear = function() {
	var self = this;
	for (hashtag in  self.tracked_hashtags) {
		self.remove(hashtag);
		self.add(hashtag);
	};
}
/*
Update firebase on the hour.
*/
Counter.prototype.millisTillNextHour = function() {
	var d = new Date();
	d.setMinutes(d.getMinutes()+1);
	d.setSeconds(0);
	d.setMilliseconds(0);
	// d.setHours(d.getHours()+1);
	return d - new Date();
}

Counter.prototype.startUpdateCycle = function() {
	var self=this;
	var scheduleUpdate = function() {
		setTimeout(function() {
			self.update();
			scheduleUpdate();
			console.log("Scheduling update");
		}, self.millisTillNextHour());
	};
	scheduleUpdate();
}

Counter.prototype.update = function() {
	var self=this;
	var fbHashtags = new Firebase(process.env.FIREBASE_URL + '/users/testUser/');
	for (hashtag in self.tracked_hashtags) {
		var time = Date.now().toString();
		fbHashtags.child(hashtag).child(time).set(self.tracked_hashtags[hashtag]);
		console.log('Pushing hashtag:' + hashtag + "\n");
	};
	self.clear();
}


Counter.prototype.start = function() {
	var self=this;
	self.ee.on('tweet', self.parseTweet);
}

Counter.prototype.stop = function() {
	var self=this;
	self.ee.removeListener("tweet",self.parseTweet);
}



module.exports = Counter;