require([
    '$api/models',
    '/scripts/lib/ICanHaz.min',
    '/scripts/VenueRadio',
    '/scripts/VenueRadioUtil',
    '/scripts/ScreenMgr',
    '/scripts/PlaylistView',
    '/scripts/ScreenMgr',
], function(
  m,
  ich,
  VR
) {

  VR['PlaylistController'] = (function() {
    var SERVER_URL = "http://localhost:5000/";
    var SEATGEEK_URL = "http://api.seatgeek.com/2/";
    var LIST_NAME = "thelist";

    var self = {};

    // var m = VR.sp.require("sp://import/scripts/api/models");
    var util = VR.Util;

    var view;

    var sp_playlist_uri;
    
    self.init = function(container) {
      util.log_current_fn("PlaylistController.init", "" /*Array.prototype.slice.call(arguments)*/);

      view = VR.PlaylistView;
      view.init(container);

      var sp_tmp_playlist_promise = new m.Playlist.createTemporary("venueradio-playlist").done(function(playlist) {
        console.log("playlist created!");
        console.log(playlist);
        sp_playlist_uri = playlist.uri;
      });

      // m.player.addEventListener('change', updateNowPlayingWidget);

    };

    self.play = function() {
      console.log("play playlist!");
      m.player.playContext(m.Playlist.fromURI(sp_playlist_uri));  
      // setTimeout(function () {
      //   m.player.setShuffle(false).done(function() {
      //     m.player.setShuffle(true);
      //   });
      // }, 500);
      
    };

    self.shuffle = function() {
      m.player.setShuffle(false).done(function() {
        m.player.setShuffle(true);
      });
    };

    self.stop = function() {
      m.player.pause();
    };

    self.clear = function (done_fn) {
      m.Playlist.fromURI(sp_playlist_uri).load('name', 'tracks').done(function(the_playlist) {
        console.log(the_playlist);

        the_playlist.tracks.clear().done(function(tracks) {
          console.log("playlist cleared");
          done_fn();
        });
      });
    };

    self.addTracks = function(tracks, done_fn) {
      // util.log_current_fn("PlaylistController.addTracks", "" /*Array.prototype.slice.call(arguments)*/);  

      m.Playlist.fromURI(sp_playlist_uri).load('name', 'tracks').done(function(the_playlist) {
        the_playlist.tracks.add(tracks).done(function() {
          // console.log("tracks added");
          done_fn();
        });
      });
    };

    //
    // HANDLERS
    //

    self.onTrackChanged = function() {

    }

    return self;
  })();

});