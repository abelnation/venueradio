
VR['UserData'] = (function() {

  var self = {};

  self.init = function() {
  };

  self.testStore = function(key, value) {
    localStorage[key] = value;
  };

  self.testGet = function(key) {
    return localStorage[key];
  };

  function isAvailable() {
    if (localStorage != undefined) { return true; }
    else { return false; }
  }

  return self;
})();