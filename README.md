venueradio
==========

To install the app, run:
	~$ ./install_app.sh 

To load the app in spotify type the following into the spotify search bar:
	spotify:app:venueradio

Each time you make changes, run:
	~$ ./install_app.sh
to load the spotify app into the correct location

SeatGeek API Docs:
	http://platform.seatgeek.com/

Spotify API Docs:
	https://developer.spotify.com/technologies/apps/

Pretty Print JSON from terminal:
	~$ curl 'http://api.seatgeek.com/2/venues?city=san-francisco' | python -mjson.tool



FYI
===

models.Playlist.createTemporary("A temporary playlist").done(function(playlist) { 
    playlist.load("tracks").done(function(loadedPlaylist) {
         loadedPlaylist.tracks.add(models.Track.fromURI("spotify:track:2Vy4z1ZUN7RvN7syWI2yef"));
         loadedPlaylist.tracks.add(models.Track.fromURI("spotify:track:2pj2VXKSBRTmV8nuiaCKd2"));
    });
});
