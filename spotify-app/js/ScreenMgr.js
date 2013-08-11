VR['ScreenMgr'] = (function() {
    var self = {};

    var ui_container;
    var current_view;

    self.init = function(container) {
      ui_container = $("#container");
    };

    self.getContainer = function() { return ui_container; }

    self.show = function(view) {
      console.log("show");
      console.log(view);
      if (current_view) {
        current_view.getContainer().addClass('hide');  
      }
      view.getContainer().removeClass('hide');
      current_view = view;
    }

    return self;
  })();