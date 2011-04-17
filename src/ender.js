!function () {
  var s = $script.noConflict();
  $.ender({
    script: s,
    ready: s.ready,
    require: s,
    getScript: s.get
  });
}();