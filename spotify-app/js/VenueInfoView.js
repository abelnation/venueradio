require([
    '$api/models',
], function(m) {

  VR['VenueInfoView'] = (function() {

    var self = {};

    // var v = VR.sp.require("sp://import/scripts/api/views");
    // var fx = VR.sp.require('sp://import/scripts/fx');
    // var ui = VR.sp.require('sp://import/scripts/ui');

    var util = VR.Util;

    var ui_container;
    var ui_content;
    var ui_performer_list;

    self.init = function(container) {
      util.log_current_fn("VenueInfoView.init", Array.prototype.slice.call(arguments));
      
      ui_container = ich.ich_app_screen();
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

    function setupEventList(venueEventListData) {
      util.log_current_fn(arguments.callee.name, Array.prototype.slice.call(arguments));  

      ui_content.empty();
      ui_performer_list = ich.ich_performer_list();
      ui_content.append(ui_performer_list);

      var events = venueEventListData['events'];
      for (var i=0; i<events.length; i++) {
        var vr_event = events[i];
        console.log(vr_event);

        var performers = vr_event['performers'];
        for (var j=0; j<performers.length; j++) {
          var performer = performers[j];
          var performer_data = {
            performer_id: performer['id'],
            performer_slug: performer['slug'],
            performer_url: performer['url'],
            performer_name: performer['name'],
            performer_date: VR.Util.formatDate(vr_event['datetime_local']),
            performer_tickets_url: vr_event['url'],
          };

          // fetchPerformerInfo(data.performer_id);
          // console.log(performer);

          var performer_elem = ich.ich_performer_list_item(performer_data);
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