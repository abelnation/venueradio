//
// Top-level controller for the app
//
require([
    '$api/models',
], function(m) {
    
  VR['VenueRadioApp'] = (function() {
    var SERVER_URL = "http://localhost:5000/";
    var SEATGEEK_URL = "http://api.seatgeek.com/2/";
    var LIST_NAME = "thelist";
    
    var self = {};

  	// var m = VR.sp.require("sp://import/scripts/api/models");
  	// var v = VR.sp.require("sp://import/scripts/api/views");
  	// var fx = VR.sp.require('sp://import/scripts/fx');
  	// var ui = VR.sp.require('sp://import/scripts/ui');
    
    var util = VR.Util;
    var vr_auth = VR.Auth;
    var screen_mgr = VR.ScreenMgr;

    /* Audio Data */
  	var selected_track_num;
    var selected_track_row;
  	var playing_track_num;
    var playing_track_row;

    /* Controllers */
    var venues_controller;
    var venueinfo_controller;
    var playlist_controller;

    /* UI Elements */
  	var ui_container;
    var ui_performer_list;

    self.init = function() {
      util.log_current_fn("VenueRadioApp.init", Array.prototype.slice.call(arguments));

      screen_mgr.init();

      venues_controller = VR.VenuesController;
      venues_controller.init(screen_mgr.getContainer(), "san-francisco");

      venueinfo_controller = VR.VenueInfoController;
      venueinfo_controller.init(screen_mgr.getContainer());

      playlist_controller = VR.PlaylistController;
      playlist_controller.init(screen_mgr.getContainer());

      screen_mgr.show(venues_controller.getView());
      // doAuth();
      // vr_auth.doAuth();

    	// When a track is dropped on the app from spotify
    	// m.application.observe(m.EVENT.LINKSCHANGED, onTrackDropped);
    };
    

    /* 
     * SERVER CALLS 
     */

    function fetchPerformerInfo(performer_id) {
      util.log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

      var url = SEATGEEK_URL + "performers/" + performer_id
      $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: onPerformerInfoReceived,
      });
    }

    function playArtist(performer_uri) {
      util.log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

      var tracks = new m.Playlist();

      console.log(performer_uri);
      var martist = m.Artist.fromURI(performer_uri, function(artist) {
        console.log(artist);  
      });
      // console.log(martist);
      // martist.load(['albums']).done(function(artist) {
      //   console.log(artist);
      //   var albums = artist.albums;

      //   for (var i=0, l=albums.length; i < l; i++) {
      //     var tracks = albums[i].tracks;
      //     console.log(tracks);
      //   }
      // });
      
    }


    function loginUser(user_info) {
      util.log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

      console.log("STUB: implement login");
      return;

      // var url = SERVER_URL + "login";
      // $.ajax({
      //   dataType: "json",
      //   url: url,
      //   method: 'post',
      //   data: {
      //     'json': JSON.stringify({
      //       id: user_info['id'],
      //       username: user_info['username'],
      //       link: user_info['link'],
      //       name: ""+ user_info['first_name'] + " " + user_info['last_name'],
      //     }),
      //   },
      //   success: onUserLoggedIn,
      // });
    }


    /*
     * HANDLERS
     */
    self.onVenueSelected = function(venue_id) {
      util.log_current_fn("VenueRadioApp.onVenueSelected", Array.prototype.slice.call(arguments));  

      VR.UserData.userViewedVenue(venue_id);
      VR.VenuesView.reloadVenuesViewed(VR.UserData.getVenuesViewed());

      VR.PlaylistController.clear(function() {
        venueinfo_controller.loadVenue(venue_id);
        screen_mgr.show(venueinfo_controller.getView());  
      });
      
    }

    function onPerformerClicked(e) {
      util.log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  

      var performer_uri = $(e.target).data("uri");
      playArtist(performer_uri);
    }

    return self;
  })();

  VR['VenueRadioApp'].init();
});

$(function() {
	
});

