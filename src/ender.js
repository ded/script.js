!function () {
  var s = $script.noConflict();
  $.ender({
    script: s,
    domReady: s.domReady
  });
}();