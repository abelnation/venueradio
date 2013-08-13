require([
    '$api/models',
    '/scripts/lib/ICanHaz.min',
    '/scripts/VenueRadio',
    '/scripts/VenueRadioUtil',
], function(
  m,
  ich,
  VR) {

  VR['Auth'] = (function() {

    var self = {};

    var util = VR.Util;
    // var auth = VR.sp.require('sp://import/scripts/api/auth');
    var auth;

    /* User Data */
    var fb_access_token;
    var current_user;

    self.init = function() {

    };

    self.doAuth = function() {
      util.log_current_fn("Auth.doAuth", "" /*Array.prototype.slice.call(arguments)*/);

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


    //
    // DATA API CALLS
    //

    function fetchUserFacebookInfo(accessToken) {
      util.log_current_fn("Auth.fetchUserFacebookInfo", "" /*Array.prototype.slice.call(arguments)*/);

      var url = "https://graph.facebook.com/me?access_token=" + accessToken;
      $.ajax({
        dataType: "json",
        url: url,
        data: {},
        success: onUserInfoReceived,
      });
    }


    //
    // HANDLERS
    //

    function onUserInfoReceived(user_info) {
      util.log_current_fn("Auth.onUserInfoReceived", "" /*Array.prototype.slice.call(arguments)*/);

      loginUser(user_info)

      console.log(user_info);
    }

    return self;
  })();
  
});