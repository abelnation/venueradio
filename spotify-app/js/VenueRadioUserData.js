
VR['UserData'] = (function() {

  var self = {};

  var muted_artists = {};
  var artist_ratings = {};
  
  var shows_interested = {};
  var venues_viewed = {};

  self.init = function() {

  };

  self.getVenuesViewed = function() {
    console.log("1.1");
    if ('venues_viewed' in localStorage) {
      var vv = JSON.parse(localStorage['venues_viewed']);
      console.log(vv);
      return vv;  
    } else {
      var vv = {};
      localStorage['venues_viewed'] = JSON.stringify({});
      return vv;
    }
    
  };
  self.userViewedVenue = function(venue_sg_id) {
    self.addToCountForValue("venues_viewed", venue_sg_id);
  };


  //
  // UTILITY FUNCTIONS
  //

  self.addToCountForValue = function(key, value) {
    var collection;
    if (key in localStorage) {
      collection = JSON.parse(localStorage[key]); 
    } else {
      collection = {};
    }
    
    if (value in collection) {
      collection[value] += 1;  
    } else {
      collection[value] = 1;
    }
    localStorage[key] = JSON.stringify(collection);
  }

  // self.addToCollection = function(key, value) {
  //   var collection = JSON.parse(localStorage[key]);
  //   collection.push(value);
  //   localStorage[key] = JSON.stringify(collection);
  // }

  self.testStore = function(key, value) {
    localStorage[key] = value;
  };

  self.testGet = function(key) {
    return localStorage[key];
  };

  function isAvailable() {
    if (localStorage != undefined) { return true; }
    else { return false; }
  }

  return self;
})();