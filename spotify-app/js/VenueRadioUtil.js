/*
 * UTILITY FUNCTIONS
 */ 

VR['Util'] = (function() {

  var self = {};

  self.formatDate = function(isotimestamp) {
    var d = new Date(isotimestamp);
    return d.toDateString();
  };
  self.dayOfWeekStringFor = function(day) {
    days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    return days[day];
  }
  self.dayOfWeekAbbrStringFor = function(day) {
    days = [
      "Sun",
      "Mon",
      "Tues",
      "Wed",
      "Thur",
      "Fri",
      "Sat"
    ];
    return days[day];
  }
  self.monthStringFor = function(month) {
    months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  }

  self.makeRandomComment = function() {
    var names = ['Abel Allison', 'Steve Ritter', 'Karthi Karunanidhi', 'Andreas Brandhaugen', 'Ross Wait'];
    var comments = [
      'Dude this is sick...',
      'Hahaha, awesome',
      'Nice',
      'Word, sounds kinda like the Smiths',
      'Thanks for this!'
    ];
    return {
      'author': randomElem(names),
      'comment': randomElem(comments),
    };
  };

  self.makeArtistString = function(artist_arr) {
  	var result = "";
  	for(var i=0; i<artist_arr.length; i++) {
  		var artist = artist_arr[i];
  		result += artist.name + " ";
  	}
  	return result;
  };

  self.toTitleCase =function(str) {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  self.randomInt = function(max) {
  	return Math.floor(Math.random()*max);
  };

  self.randomElem = function(arr) {
    return arr[Math.floor(randomInt(arr.length))];
  };

  self.log_current_fn = function(name, args) {
    // var args_str = "";
    // for(var i=0;i<args.length; i++) {
    //   args_str += args[i] + ", ";
    // }
    console.log("" + name + ": " + args.join());
    console.log(args)
  };

  return self;
})();