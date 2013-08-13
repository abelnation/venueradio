require([
    '$api/models',
    '/scripts/VenueRadio',
    '/scripts/VenueRadioUtil',
    '/scripts/VenueInfoView',
    '/scripts/PerformerData',
    '/scripts/PlaylistController',
], function(
  m,
  VR
) {

  VR['VenueInfoController'] = (function() {
    var SERVER_URL = "http://localhost:5000/";
    var SEATGEEK_URL = "http://api.seatgeek.com/2/";

    var MAX_EVENTS = 40;

    var self = {};
    
    var util = VR.Util;

    var performers = [];

    var view;

    self.init = function(container) {
      util.log_current_fn("VenueInfoController.init", "" /*Array.prototype.slice.call(arguments)*/);
      
      // TODO: need to figure out how to manage dependencies correctly
      setTimeout(function() {
        view = VR.VenueInfoView;
        view.init(container);  
      }, 1000);
      
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

      for (var i=0; i<events.length; i++) {
      
        var vr_event = events[i];
        var performers = vr_event['performers'];

        //for (var j=0; j<performers.length; j++) {
        for (var j=0; j<3; j++) {

          var performer = performers[j];
          performers.push(performer);
          artists_waiting += 1;
          VR.PerformerData.getPerformerTracks(performer['id'], 
            (function(performer_data) {
              return function(tracks, artist_uri) {
                console.log("Got tracks for performer!");
                artists_waiting -= 1;
                view.setArtistURI(performer_data, artist_uri);
                VR.PlaylistController.addTracks(tracks, function() {
                    
                    VR.PlaylistController.shuffle();
                    if (!started_playing) {
                      console.log("Beginning venue playlist")
                      VR.PlaylistController.play();  
                      started_playing = true;  
                    }

                  }
                )
              }
            })(performer),
            function(performer_data) {
              artists_waiting -= 1;
              console.log("Could not get tracks for: " + performer_data['name']);
              view.noArtistData(performer_data);
            })
        } // End For
      } // End For
    }

    //
    // DATA API CALLS
    //

    function fetchVenueEvents(venue_id, max_events) {
      util.log_current_fn("VenueInfoController.fetchVenueEvents", "" /*Array.prototype.slice.call(arguments)*/);

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
      util.log_current_fn("VenueInfoController.onVenueEventListReceived", "" /*Array.prototype.slice.call(arguments)*/);  
      
      console.log(venueEventListData);
      console.log(venueEventListData['events'][0].venue.name);
      view.setVenueName(venueEventListData['events'][0].venue.name);
      view.onVenueEventListReceived(venueEventListData);
      self.loadVenueRadio(venueEventListData);
      
    }

    return self;
  })();

});