var VenueRadioApp = (function() {
  var SERVER_URL = "http://localhost:5000/";
  var SEATGEEK_URL = "http://api.seatgeek.com/2/";
  var LIST_NAME = "thelist";
  
  var self = {};

  var sp = getSpotifyApi(1);
	var m = sp.require("sp://import/scripts/api/models");
	var v = sp.require("sp://import/scripts/api/views");
	var fx = sp.require('sp://import/scripts/fx');
	var ui = sp.require('sp://import/scripts/ui');
  var auth = sp.require('sp://import/scripts/api/auth');

  
  /* User Data */
  var fb_access_token;
  var current_user;

  var current_city = "san-francisco" // STUB: make city picker/detector

  /* Audio Data */
	var selected_track_num;
  var selected_track_row;
	var playing_track_num;
  var playing_track_row;

  /* UI Elements */
	var ui_container;
  var ui_venue_list;
  var ui_performer_list;

  self.init = function() {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));
    
    initUI();

  	fetchVenueList(30);

    doAuth();

  	// When a track is dropped on the app from spotify
  	// m.application.observe(m.EVENT.LINKSCHANGED, onTrackDropped);
  };

  function doAuth() {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

    auth.authenticateWithFacebook('554341824586878', ['user_about_me'], {

      onSuccess : function(accessToken, ttl) {
        console.log("Success! Here's the access token: " + accessToken);

        fb_access_token = accessToken;
        fetchUserFacebookInfo(accessToken);
      },

      onFailure : function(error) {
        console.log("Authentication failed with error: " + error);
      },

      onComplete : function() { }
    });

    // current_user = m.session.anonymousUserID;
  }

  /* 
   * SERVER CALLS 
   */

  function fetchVenueList(max_venues) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

    var url = SEATGEEK_URL + "venues" +
      "?sort=score.desc&per_page=" + max_venues + 
      "&city=" + current_city;
    $.ajax({
      dataType: "json",
      url: url,
      data: {},
      success: onVenueListReceived,
    });

  }

  function fetchVenueEvents(venue_id, max_events) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

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

  function fetchPerformerInfo(performer_id) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

    var url = SEATGEEK_URL + "performers/" + performer_id
    $.ajax({
      dataType: "json",
      url: url,
      data: {},
      success: onPerformerInfoReceived,
    });
  }

  function playArtist(performer_uri) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

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

  function fetchUserFacebookInfo(accessToken) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

    var url = "https://graph.facebook.com/me?access_token=" + accessToken;
    $.ajax({
      dataType: "json",
      url: url,
      data: {},
      success: onUserInfoReceived,
    });
  }

  function loginUser(user_info) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

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

  function onUserInfoReceived(user_info) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));

    loginUser(user_info)

    console.log(user_info);
  }

  function onVenueListReceived(venueListData, textStatus) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  
    setupVenueList(venueListData);
  }

  function onVenueEventListReceived(venueEventListData, textStatus) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  
    setupEventList(venueEventListData);
  }

  function onPerformerInfoReceived(performerData, textStatus) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  
    var spotify_uri = "";
    for (var i=0; i<performerData['links'].length; i++) {
      var link_data = performerData['links'][i];
      if(link_data['provider'] == "spotify") {
        spotify_uri = link_data['id'];
        break;
      }
    }

    if (spotify_uri != "") {
      var data = {
        performer_name: performerData['name'],
        performer_slug: performerData['slug'],
        performer_uri: spotify_uri,
        performer_id: performerData['id'],
      };
      var performer_list_elem = ich.ich_performer_list_item(data);
      ui_performer_list.append(performer_list_elem);
      performer_list_elem.click(onPerformerClicked);

      console.log(performerData['name'] + ": " + spotify_uri);
    } else {
      console.log("Artist does not have a spotify uri");
    }
    console.log(performerData);
  }

  function onVenueClicked(e) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  
    
    var venue_slug = $(e.target).data("slug");
    var venue_id = $(e.target).data("id");
    console.log(venue_slug + " " + venue_id);

    fetchVenueEvents(venue_id, 50);
  }

  function onLikeTrack(e) {
    likeTrack(selected_track_num);
  }

  function onPerformerClicked(e) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  

    var performer_uri = $(e.target).data("uri");
    playArtist(performer_uri);
  }

  /*
   * UI INITIALIZATION
   */

  function initUI() {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  

    ui_container = $("#container");
  }

  function setupVenueList(venueListData) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  

    ui_venue_list = ich.ich_venue_list(venueListData);
    ui_container.append(ui_venue_list);

    for (var i=0; i<venueListData.venues.length; i++) {
      var venue_data = venueListData['venues'][i];
      var venue_name = venue_data['name'];
      var venue_slug = venue_data['slug'];
      var venue_id =   venue_data['id']

      var data = {
        venue_name: venue_name,
        venue_id: venue_id,
        venue_slug: venue_slug,
      }

      var venue_elem = ich.ich_venue_list_item(data);
      ui_venue_list.append(venue_elem);
      venue_elem.click(onVenueClicked);
    }

    console.log(venueListData);
  }

  function setupPerformerList(performerListData) {

  }

  function setupEventList(venueEventListData) {
    log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  

    ui_container.empty();
    ui_performer_list = ich.ich_performer_list();
    ui_container.append(ui_performer_list);

    var events = venueEventListData['events'];
    for (var i=0; i<events.length; i++) {
      var vr_event = events[i];
      var performers = vr_event['performers'];
      for (var j=0; j<performers.length; j++) {
        var performer = performers[j];
        var performer_id = performer['id'];
        fetchPerformerInfo(performer_id);
        console.log(performer);
      }
    }
  }


  function createPlaylistTrackItem(track_num, track) {
    // log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));
  	
    var num_likes = track['num_likes'];
		var num_comments = track['num_comments']
		var num_plays = track['num_plays'];

  	var track_data = {
  		'track_num': track_num,
  		'title': track.title,
  		// 'artist': makeArtistString(track.artist),
      'artist': track.artist,
   		'num_likes': num_likes != 0 ? num_likes : "",
   		'num_comments': num_comments != 0 ? num_comments : "",
   		'num_plays': num_plays != 0 ? num_plays : "",
  	}
  	var elem = ich.ich_playlist_track(track_data);

    elem.click(onSelectTrack);
    elem.dblclick(onPlayTrack);

  	return elem;
  }


  /*
   * UTILITY FUNCTIONS
   */ 

  function formatDate(isotimestamp) {
    var d = new Date(isotimestamp);
    return d.toDateString();
  }

  function makeRandomComment() {
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
  }

  function makeArtistString(artist_arr) {
  	var result = "";
  	for(var i=0; i<artist_arr.length; i++) {
  		var artist = artist_arr[i];
  		result += artist.name + " ";
  	}
  	return result;
  }

  function randomInt(max) {
  	return Math.floor(Math.random()*max);
  }

  function randomElem(arr) {
    return arr[Math.floor(randomInt(arr.length))];
  }

  function log_current_fn(name, args) {
    // var args_str = "";
    // for(var i=0;i<args.length; i++) {
    //   args_str += args[i] + ", ";
    // }
    console.log("" + name + ": " + args.join);
    console.log(args)
  }

  return self;
})();

$(function() {
	VenueRadioApp.init();
});