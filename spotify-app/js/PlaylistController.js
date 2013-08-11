require([
    '$api/models',
], function(m) {

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
      util.log_current_fn("PlaylistController.init", Array.prototype.slice.call(arguments));

      view = VR.PlaylistView;
      view.init(container);

      var sp_tmp_playlist_promise = new m.Playlist.createTemporary("venueradio-playlist").done(function(playlist) {
        console.log("playlist created!");
        console.log(playlist);
        sp_playlist_uri = playlist.uri;

        // m.Playlist.fromURI(playlist.uri).load('name', 'tracks').done(function(the_playlist) {
        //   console.log("from uri playlist!");
        //   console.log(the_playlist);
          
        //   the_playlist.tracks.add(
        //     m.Track.fromURI("spotify:track:5weaMKbpUyNejn9C5Q2mLO"),
        //     m.Track.fromURI("spotify:track:5vh0iJtnzdClF1Poqw0VAj"),
        //     m.Track.fromURI("spotify:track:601KiLiZtBJRTXBrTjeieP"),
        //     m.Track.fromURI("spotify:track:29aCzWypaMOYAwfRkk71UQ")
        //   ).done(function() {
        //     m.player.playContext(m.Playlist.fromURI(sp_playlist_uri));
        //   });

        // });

      });

    };

    self.play = function() {
      console.log("play playlist!");
      m.player.setShuffle(true);
      m.player.playContext(m.Playlist.fromURI(sp_playlist_uri));
    };

    self.stop = function() {
      m.player.pause();
    };

    self.clear = function (done_fn) {
      m.Playlist.fromURI(sp_playlist_uri).load('name', 'tracks').done(function(the_playlist) {
        console.log(the_playlist);

        the_playlist.tracks.clear().done(function(tracks) {
          console.log("playlist cleared");
          console.log("tracks length: " + tracks.length);
          done_fn();
        });
      });
    };

    self.addTracks = function(tracks, done_fn) {
      // util.log_current_fn("PlaylistController.addTracks", Array.prototype.slice.call(arguments));  

      m.Playlist.fromURI(sp_playlist_uri).load('name', 'tracks').done(function(the_playlist) {
        // console.log("from uri playlist!");
        // console.log(the_playlist);

        the_playlist.tracks.add(tracks).done(function() {
          // console.log("tracks added");
          done_fn();
        });
        
        // var sp_tracks = [];
        // for(var i=0; i<tracks.length; i++) {
        //   sp_tracks.push(m.Track.fromURI(tracks[i].uri));
        // } 
        // console.log(sp_tracks);

        // the_playlist.tracks.add(sp_tracks).done(function() {
        //   console.log("tracks added");
        //   done_fn();
        // });
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