VR['ScreenMgr'] = (function() {
    var self = {};

    var ui_container;
    var ui_left_col;
    var ui_right_col;

    var current_view;

    self.init = function(container) {
      ui_container = $("#container");
      ui_left_col = $("#left-col");
      ui_right_col = $("#right-col");
    };

    self.getContainer = function() { return ui_container; }
    self.getLeftCol = function() { return ui_left_col; }
    self.getRightCol = function() { return ui_right_col; }

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