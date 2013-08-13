require([
  '$api/models', 
  '$views/image#Image',
  '/scripts/lib/ICanHaz.min',
  '/scripts/VenueRadio',
  '/scripts/VenueRadioUtil',
  '/scripts/ScreenMgr',
  '/scripts/VenuesController',
], function(
  m, Image,
  ich,
  VR
) {

  VR['VenueInfoView'] = (function() {

    var self = {};

    // var v = VR.sp.require("sp://import/scripts/api/views");
    // var fx = VR.sp.require('sp://import/scripts/fx');
    // var ui = VR.sp.require('sp://import/scripts/ui');

    var util = VR.Util;

    var ui_container;
    var ui_content;
    var ui_performer_list;

    self.init = function(container, venue_name) {
      util.log_current_fn("VenueInfoView.init", "" /*Array.prototype.slice.call(arguments)*/);
      
      ui_container = ich.ich.ich_app_screen({
        view_subtitle: "Events at",
        view_title: venue_name
      });
      container.append(ui_container);
      ui_content = ui_container.find(".content");

      ui_container.find(".back-button").click(function() {
        VR.ScreenMgr.show(VR.VenuesController.getView());
      });
    };

    self.getContainer = function() { return ui_container; }


    //
    // UI
    //

    self.setVenueName = function(venue_name) {
      var header = ui_container.find(".view-title");
      console.log(venue_name);
      console.log(header);
      header.html(venue_name);
    };

    self.setArtistURI = function(performer_data, artist_uri) {
      console.log("setArtistUri: " + artist_uri);
      console.log(performer_data);

      var artist = m.Artist.fromURI(artist_uri);
      var image = Image.forArtist(artist, {width: 60 ,height: 60});
      
      var slug = performer_data['slug'];
      var elem = ui_content.find("li[data-slug='" + slug + "']");
      elem.data("uri", artist_uri);
      elem.find(".performer-link").attr("href", artist_uri);
      //console.log(image);
      console.log(elem);
      // console.log(elem.find(".performer-photo"));
      
      elem.find(".performer-photo").empty().append(image.node);
    }

    self.noArtistData = function(performer_data) {
      util.log_current_fn("VenueInfoView.noArtistData", "" /*Array.prototype.slice.call(arguments)*/);

      var slug = performer_data['slug'];
      var elem = ui_content.find("a[data-slug='" + slug + "']");

      console.log(slug);
      console.log(elem);

      elem.addClass("no-data");
    };

    function setupEventList(venueEventListData) {
      util.log_current_fn("setupEventList", "" /*Array.prototype.slice.call(arguments)*/);  

      ui_content.empty();
      ui_performer_list = ich.ich.ich_performer_list();
      ui_content.append(ui_performer_list);

      var events = venueEventListData['events'];
      for (var i=0; i<events.length; i++) {
        var vr_event = events[i];
        console.log(vr_event);

        var event_date = new Date(vr_event['datetime_local']);
        var day_of_week = VR.Util.dayOfWeekAbbrStringFor(event_date.getDay());
        var day_of_month = event_date.getDate();
        var month = event_date.getMonth();

        // console.log("" + day_of_week + " " + day_of_month + " " + event_date.getMonth());

        var performers = vr_event['performers'];
        for (var j=0; j<performers.length; j++) {
          var performer = performers[j];
          var performer_data = {
            performer_id: performer['id'],
            performer_slug: performer['slug'],
            performer_url: performer['url'],
            performer_name: performer['name'],
            performer_date: VR.Util.formatDate(vr_event['datetime_local']),
            day_of_month: day_of_month,
            day_of_week: day_of_week,
            performer_tickets_url: vr_event['url'],
          };

          // fetchPerformerInfo(data.performer_id);
          // console.log(performer);

          var performer_elem = ich.ich.ich_performer_list_item(performer_data);

          ui_performer_list.append(performer_elem);
        }
      }
    }

    //
    // HANDLERS
    //
    self.onVenueEventListReceived = function(venueEventListData) {
      setupEventList(venueEventListData);
    };

    return self;
  })();

});