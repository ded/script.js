!function () {
  var s = $script.noConflict();
  $.ender({
    script: s,
    require: s,
    getScript: s
  });
}();