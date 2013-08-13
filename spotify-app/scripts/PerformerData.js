require([
    '$api/models',
    '$api/search',
    '/scripts/lib/ICanHaz.min',
    '/scripts/VenueRadio',
    '/scripts/VenueRadioUtil',
], function(
  m, s,
  ich,
  VR) {

  VR['PerformerData'] = (function() {
    var SEATGEEK_URL = "http://api.seatgeek.com/2/";
    var MAX_TRACKS = 10;

    var self = {};

    self.getPerformerTracks = function(performer_sg_id, done_fn, fail_fn) {
      // console.log("Get performer tracks: " + performer_sg_id);
      fetcher(performer_sg_id, done_fn, fail_fn); 
    }

    function fetcher(performer_sg_id, done_fn, fail_fn) {
      var num_albums_to_fetch;
      var all_tracks = [];

      console.log("starting fetcher for: " + performer_sg_id);
      getSpotifyURI(performer_sg_id);

      function getSpotifyURI(performer_sg_id) {
        var url = SEATGEEK_URL + "performers/" +
          performer_sg_id;

        $.ajax({
          dataType: "json",
          url: url,
          data: {},
          success: onPerformerSgDataReceived,
        });

      }

      function onPerformerSgDataReceived(performerData) {
        console.log("onPerformerSgDataReceived");
        // console.log(performerData);
        var spotify_uri = "";

        for (var i=0; i<performerData.links.length; i++) {
          var link = performerData.links[i];
          if (link.provider == "spotify") {
            spotify_uri = link.id;
            break;
          }
        }

        if (spotify_uri != "") { 
          onSpotifyURIReceived(spotify_uri);
          return;
        } 

        // If no URI provided by SG, search manually
        var so = s.Search.search(performerData['name']); 
        so.artists.snapshot().done(function(artists) { 
          if (artists._uris.length > 0) {
            console.log("found artist by searching");
            console.log(artists._uris[0]);
            onSpotifyURIReceived(artists._uris[0]);
          } else {
            // give up
            onNoSpotifyURI(performerData);    
          }
        }); 
        
      }

      function onSpotifyURIReceived(artist_uri) {
        // console.log("Artist spotify uri: " + artist_uri);
        getAlbums(artist_uri);
      }

      function onNoSpotifyURI(artist_name) {
        // console.log("Artist does not have spotify uri...");
        fail_fn(artist_name);
      }

      function getAlbums(artist_uri) {
        // console.log("getAlbums");
        m.Artist.fromURI(artist_uri).load('name', 'albums').done(function(artist) {
          // console.log(artist);
          artist.albums.snapshot().done(function(snapshot) {
            num_albums_to_fetch = snapshot.length;

            for(var i=0; i<snapshot.length; i++) {
              if (num_albums_to_fetch <= 0 || all_tracks.length >= 20) {
                continue;
              }
              
              // console.log(snapshot.get(i));
              var album_uri = snapshot.get(i).albums[0].uri;
              // console.log(album_uri);
              getAlbumTracks(album_uri, artist_uri);  
            }

            
          }).fail(function() {
            console.log("FAIL: Artist albums snapshot");
          });
        });
      }

      function getAlbumTracks(album_uri, artist_uri) {
        m.Album.fromURI(album_uri).load('name', 'tracks').done(function(album) {
          // console.log(album);
          album.tracks.snapshot().done(function(snapshot) {
            // console.log("num left: " + num_albums_to_fetch);
            // console.log("all_tracks length: " + all_tracks.length);
            if (num_albums_to_fetch <= 0 || all_tracks.length >= MAX_TRACKS) {
              num_albums_to_fetch -= 1;
              return;
            }

            for(var i=0; i<snapshot.length; i++) {
              
              var track = snapshot.get(i);
              if (track.playable) {
                all_tracks.push(track);    
              } else {
                console.log("track not availabile: " + track.availability);
              }
            
              if (num_albums_to_fetch <= 0 || all_tracks.length >= MAX_TRACKS) {
                num_albums_to_fetch -= 1;
                done_fn(all_tracks, artist_uri);
                return;
              }
            }
            num_albums_to_fetch -= 1;
          }).fail(function() {
            console.log("FAIL: Album tracks snapshot");
          });
        });
      }
    } // END FETCHER

    return self;
  })();

});