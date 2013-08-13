require([
    '$api/models',
    '/scripts/lib/ICanHaz.min',
    '/scripts/VenueRadio',
    '/scripts/VenueRadioUtil',
], function(
  m,
  ich,
  VR) {

  VR['VenuesView'] = (function() {

    var self = {};

    // var m = VR.sp.require("sp://import/scripts/api/models");
    // var v = VR.sp.require("sp://import/scripts/api/views");
    // var fx = VR.sp.require('sp://import/scripts/fx');
    // var ui = VR.sp.require('sp://import/scripts/ui');

    var util = VR.Util;

    var venues_viewed;
    var venue_list_data;

    var ui_container;
    var ui_content;

    var ui_viewed_venue_list;
    var ui_venue_list;

    self.init = function(container, city_slug, venues_seen) {
      util.log_current_fn("VenuesView.init", "" /*Array.prototype.slice.call(arguments)*/);
      
      venues_viewed = venues_seen;

      var city_name = VR.Util.toTitleCase(city_slug.replace("-"," "));

      console.log("ich");
      console.log(ich);

      ui_container = ich.ich.ich_app_screen({
        view_subtitle: "Venues in",
        view_title: city_name
      });
      container.append(ui_container);
      ui_content = ui_container.find(".content");
      
      // ui_container.find(".view-title").html(city_name);
      ui_container.find(".back-button").hide();

      console.log(ui_container);
    };

    self.getContainer = function() { return ui_container; }

    self.reloadVenuesViewed = function(venues_seen) {
      venues_viewed = venues_seen;

      ui_viewed_venue_list.find("li").remove();
      for (var i=0; i<venue_list_data.venues.length; i++) {
        var venue_data = venue_list_data['venues'][i];
        var venue_name = venue_data['name'];
        var venue_slug = venue_data['slug'];
        var venue_id =   venue_data['id']

        var data = {
          venue_name: venue_name,
          venue_id: venue_id,
          venue_slug: venue_slug,
        }

        var venue_elem = ich.ich.ich_venue_list_item(data);
        if (venue_id in venues_viewed) {
          ui_viewed_venue_list.append(venue_elem);
        }
        venue_elem.click(onVenueClicked);
      }
    }

    //
    // UI
    //
    
    function setupVenueList(venueListData) {
      venue_list_data = venueListData;

      ui_viewed_venue_list = ich.ich.ich_venue_list({ list_title: "Viewed Venues" });
      ui_venue_list = ich.ich.ich_venue_list({ list_title: "All Venues"});
      ui_content.append(ui_viewed_venue_list);
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

        var venue_elem = ich.ich.ich_venue_list_item(data);
        ui_venue_list.append(venue_elem);
        if (venue_id in venues_viewed) {
          ui_viewed_venue_list.append(venue_elem);
        }
        venue_elem.click(onVenueClicked);
      }
    }
    

    //
    // EVENT HANDLERS
    //

    self.onVenueListReceived = function(venueListData) {
      util.log_current_fn("VenuesView.onVenueListReceived", "" /*Array.prototype.slice.call(arguments)*/);  

      console.log(venueListData);
      setupVenueList(venueListData);    
    }

    function onVenueClicked(e) {
      util.log_current_fn("VenuesView.onVenueClicked", "" /*Array.prototype.slice.call(arguments)*/);  
      
      var venue_slug = $(e.target).closest("a").data("slug");
      var venue_id = $(e.target).closest("a").data("id");
      console.log(venue_slug + " " + venue_id);

      VR.VenueRadioApp.onVenueSelected(venue_id);
    }


    return self;
  })();

});