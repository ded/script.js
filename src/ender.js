!function () {
  var s = $script.noConflict();
  $.augment({
    script: s,
    domReady: s.domReady
  });
}();