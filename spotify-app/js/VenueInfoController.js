require([
    '$api/models',
], function(m) {

  VR['VenueInfoController'] = (function() {
    var SERVER_URL = "http://localhost:5000/";
    var SEATGEEK_URL = "http://api.seatgeek.com/2/";

    var MAX_EVENTS = 20;

    var self = {};
    
    var util = VR.Util;

    var performers = [];

    var view;

    self.init = function(container) {
      util.log_current_fn("VenueInfoController.init", Array.prototype.slice.call(arguments));
    
      view = VR.VenueInfoView;
      view.init(container);
    };
    self.getView = function() { return view; }

    self.loadVenue = function(venue_id) {
      fetchVenueEvents(venue_id, MAX_EVENTS);
    };

    self.loadVenueRadio = function(venueEventListData) {
      console.log("loadVenueRadio!");

      var events = venueEventListData['events'];
      var artists_waiting = 0;
      var started_playing = false;
      for (var i=0; i<events.length; i++) { // TODO: remove limit
      
        var vr_event = events[i];
        var performers = vr_event['performers'];

        //for (var j=0; j<performers.length; j++) {
        for (var j=0; j<2; j++) {

          var performer = performers[j];
          performers.push(performer);
          artists_waiting += 1;
          VR.PerformerData.getPerformerTracks(performer['id'], 
            function(tracks) {
              console.log("Got tracks for performer!");
              // console.log(tracks);
              artists_waiting -= 1;
              VR.PlaylistController.addTracks(tracks, function() {
                if (artists_waiting <= 0 && !started_playing) {
                  VR.PlaylistController.play();  
                  started_playing = true;
                }
                
              });
              
            }, 
            function(artist_name) {
              artists_waiting -= 1;
              console.log("Could not get tracks for: " + artist_name);
            })
        }
      }
    }


    //
    // DATA API CALLS
    //

    function fetchVenueEvents(venue_id, max_events) {
      util.log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

      var url = SEATGEEK_URL + "events" +
        "?venue.id=" + venue_id + 
        "&per_page=" + max_events;
      $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: onVenueEventListReceived,
      });
    }

    //
    // HANDLERS
    //

    function onVenueEventListReceived(venueEventListData, textStatus) {
      util.log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  
      
      view.onVenueEventListReceived(venueEventListData);
      self.loadVenueRadio(venueEventListData);
      
    }

    return self;
  })();

});