//Test for counter file.
var EventEmitter = require("events"),
Counter = require('../tweetcounter.js');

describe("Counter", function() {

	var counter,
	ee,
	mockTweet = {
		author:"davidgljay",
		mentions:{
			hashtags:["asexuality","climatechange"],
			users:["nmebrown","stampisaur"]
		}
	};

	describe ("adding, removing and clearing", function() {

		beforeEach(function() {
			ee = new EventEmitter();
			counter = new Counter(ee);
		});

		it ("should add a hashtag", function() {
			counter.add("asexuality");
			expect(counter.tracked_hashtags.asexuality).not.toBeNull();
			expect(counter.tracked_hashtags.climatechange).toBe(undefined);	  	
		})

		it ("should remove a hashtag", function() {
			counter.add("asexuality");
			counter.remove("asexuality");
			expect(counter.tracked_hashtags.asexuality).toBe(undefined); 	
		})

		it ("should clear existing hashtags", function() {
			counter.add("asexuality");
			ee.emit('tweet',mockTweet);
			expect(counter.tracked_hashtags.asexuality.count).toBe(1);
			counter.clear();
			expect(counter.tracked_hashtags.asexuality.count).toBe(0);
		})

	})

	describe ("receiving a tweet", function() {


		beforeEach(function() {
			ee = new EventEmitter();
			counter = new Counter(ee);
			counter.add("asexuality");
			ee.emit('tweet',mockTweet);
		});

		afterEach(function() {
			counter.stop();
			counter.clear();
		})

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

	// describe("scheduling updates to firebase", function() {
	// 	beforeEach(function() {
	// 		counter = new Counter(ee);
	// 		counter.add("asexuality");
	// 		ee.emit('tweet',mockTweet);
	// 	});

	// 	it ("should start the update cycle without registering errors", function() {
	// 		counter.startUpdateCycle();
	// 	})

	// 	it ("should perform an update without registering errors", function() {
	// 		counter.update();
	// 	})

	// })

});