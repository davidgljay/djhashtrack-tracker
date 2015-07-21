//Test for counter file.
var EventEmitter = require("events"),
Counter = require('../tweetcounter.js');

describe("Counter", function() {
	describe ("receiving a tweet", function() {
	  
	  var counter;

	  beforeEach(function() {
	  	var ee = new EventEmitter();
	  	counter = new Counter(ee);
	  	counter.add("asexuality");
	    ee.emit('tweet',{
	    	author:"davidgljay",
	    	mentions:{
	    		hashtags:["asexuality","climatechange"],
	    		users:["nmebrown","stampisaur"]

	    	}
	    });
	  });

	  it("Should iterate the count of a tracked hashtag", function() {
	    expect(counter.tracked_hashtags["asexuality"]).not.toBeNull();
	    expect(counter.tracked_hashtags["climatechange"]).toBe(undefined);
	    expect(counter.tracked_hashtags["asexuality"].count).toBe(1);
	  });		
	})
});