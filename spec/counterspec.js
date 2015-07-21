//Test for counter file.
var EventEmitter = require("events"),
Counter = require('../tweetcounter.js');

describe("Counter", function() {
	describe ("receiving a tweet", function() {

		var counter;
		var ee = new EventEmitter();

		var mockTweet = {
			author:"davidgljay",
			mentions:{
				hashtags:["asexuality","climatechange"],
				users:["nmebrown","stampisaur"]

			}
		};


		beforeEach(function() {
			counter = new Counter(ee);
			counter.add("asexuality");
			ee.emit('tweet',mockTweet);
		});

		it ("should add a hashtag", function() {
			expect(counter.tracked_hashtags.asexuality).not.toBeNull();
			expect(counter.tracked_hashtags.climatechange).toBe(undefined);	  	
		})

		it("should iterate the count of a tracked hashtag", function() {
			expect(counter.tracked_hashtags.asexuality.count).toBe(1);
			ee.emit('tweet',mockTweet);
			expect(counter.tracked_hashtags.asexuality.count).toBe(2);
		});

		it ("should iterate mentions of other hashtags", function() {
			expect(counter.tracked_hashtags.asexuality.mentions.hashtags.climatechange).toBe(1);
			ee.emit('tweet',mockTweet);
			expect(counter.tracked_hashtags.asexuality.mentions.hashtags.climatechange).toBe(2);
		});

		it ("should not iterate mentions of the hashtag being tracked", function() {
			expect(counter.tracked_hashtags.asexuality.mentions.hashtags.asexuality).toBe(undefined);
		})		

		it ("should track authors", function() {
			expect(Object.keys(counter.tracked_hashtags.asexuality.authors).length).toBe(1);
			expect(counter.tracked_hashtags.asexuality.authors.davidgljay).toBe(1);
			ee.emit('tweet',mockTweet);
			expect(Object.keys(counter.tracked_hashtags.asexuality.authors).length).toBe(1);
			expect(counter.tracked_hashtags.asexuality.authors.davidgljay).toBe(2);
		})

		it ("should track mentions of other users", function() {
			expect(Object.keys(counter.tracked_hashtags.asexuality.mentions.users).length).toBe(2);
			expect(counter.tracked_hashtags.asexuality.mentions.users.nmebrown).toBe(1);
			ee.emit('tweet',mockTweet);
			expect(Object.keys(counter.tracked_hashtags.asexuality.mentions.users).length).toBe(2);
			expect(counter.tracked_hashtags.asexuality.mentions.users.nmebrown).toBe(2);
		})
	})

});