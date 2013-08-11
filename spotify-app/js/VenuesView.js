require([
    '$api/models',
], function(m) {

  VR['VenuesView'] = (function() {

    var self = {};

    // var m = VR.sp.require("sp://import/scripts/api/models");
    // var v = VR.sp.require("sp://import/scripts/api/views");
    // var fx = VR.sp.require('sp://import/scripts/fx');
    // var ui = VR.sp.require('sp://import/scripts/ui');

    var util = VR.Util;

    var ui_container;
    var ui_content;
    var ui_venue_list;

    self.init = function(container) {
      util.log_current_fn("VenuesView.init", Array.prototype.slice.call(arguments));
      
      ui_container = ich.ich_app_screen();
      container.append(ui_container);
      ui_content = ui_container.find(".content");

      console.log(ui_container);
    };

    self.getContainer = function() { return ui_container; }

    //
    // UI
    //
    
    function setupVenueList(venueListData) {
      ui_venue_list = ich.ich_venue_list(venueListData);
      ui_content.append(ui_venue_list);

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
    }
    

    //
    // EVENT HANDLERS
    //

    self.onVenueListReceived = function(venueListData) {
      util.log_current_fn("VenuesView.onVenueListReceived", Array.prototype.slice.call(arguments));  

      console.log(venueListData);
      setupVenueList(venueListData);    
    }

    function onVenueClicked(e) {
      util.log_current_fn("VenuesView.onVenueClicked", Array.prototype.slice.call(arguments));  
      
      var venue_slug = $(e.target).data("slug");
      var venue_id = $(e.target).data("id");
      console.log(venue_slug + " " + venue_id);

      VR.VenueRadioApp.onVenueSelected(venue_id);
    }


    return self;
  })();

});