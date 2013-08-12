require([
    '$api/models',
], function(m) {

  VR['VenuesController'] = (function() {
    var SERVER_URL = "http://localhost:5000/";
    var SEATGEEK_URL = "http://api.seatgeek.com/2/";

    var MAX_VENUES = 200;

    var util = VR.Util;
    
    var self = {};

    var current_city = "san-francisco" // STUB: make city picker/detector

    var view;

    self.init = function(container, city_slug) {
      util.log_current_fn("VenuesController.init", Array.prototype.slice.call(arguments));

      if (current_city != "") {
        current_city = city_slug;  
      }
      view = VR.VenuesView;
      var venues_viewed = VR.UserData.getVenuesViewed();

      view.init(container, city_slug, venues_viewed);

    	fetchVenueList(MAX_VENUES);
    };
    self.getView = function() { return view; }

    //
    // DATA API CALLS
    //

    function fetchVenueList(max_venues) {
      util.log_current_fn("VenuesController.fetchVenueList", Array.prototype.slice.call(arguments));

      var url = SEATGEEK_URL + "venues" +
        "?sort=score.desc&per_page=" + max_venues + 
        "&city=" + current_city;

      console.log("fetching venues: " + url);
      $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: onVenueListReceived,
      });
    }


    // 
    // HANDLERS
    // 

    function onVenueListReceived(venueListData, textStatus) {
      util.log_current_fn("VenuesController.onVenueListReceived", Array.prototype.slice.call(arguments));  
      
      console.log(venueListData);
      view.onVenueListReceived(venueListData);
    }


    return self;
  })();

});