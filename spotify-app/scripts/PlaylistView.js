require([
    '$api/models',
    '/scripts/lib/ICanHaz.min',
    '/scripts/VenueRadio',
    '/scripts/VenueRadioUtil',
], function(
  m, 
  ich, 
  VR
) {
  
  VR['PlaylistView'] = (function() {

    var self = {};

    // var m = VR.sp.require("sp://import/scripts/api/models");
    // var v = VR.sp.require("sp://import/scripts/api/views");
    // var fx = VR.sp.require('sp://import/scripts/fx');
    // var ui = VR.sp.require('sp://import/scripts/ui');

    var util = VR.Util;

    var ui_container;

    self.init = function(container) {
      util.log_current_fn("PlaylistView.init", "" /*Array.prototype.slice.call(arguments)*/);
      
      ui_container = container;
      console.log(container);
    };

    return self;
  })();

});