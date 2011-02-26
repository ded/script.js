/*! $script.js http://goo.gl/x6CM3
(C) 2011 Dustin Diaz, Jacob Thornton, Yesudeep Mangalapilly
CC Attribution License: http://goo.gl/YMnSv*/window.$script = (function(window, document, timeout) {
  var $script, all, delay, each, firstScriptElement, list, scriptIds, scriptUrls;
  scriptIds = {};
  scriptUrls = {};
  list = {};
  delay = {};
  firstScriptElement = document.getElementsByTagName("script")[0];
  document.documentElement.className += ' js';
  all = function(array, iterator) {
    var element, i, _len;
    for (i = 0, _len = array.length; i < _len; i++) {
      element = array[i];
      if (!iterator(element, i, array)) {
        return 0;
      }
    }
    return 1;
  };
  each = function(array, test_function) {
    all(array, function(element, i) {
      return !test_function(element, i, array);
    });
  };
  !document.readyState && document.addEventListener && (function() {
    var fn;
    fn = function() {
      document.removeEventListener("DOMContentLoaded", fn, 0);
      document.readyState = "complete";
    };
    document.addEventListener("DOMContentLoaded", fn, 0);
  })();
  $script = function(urls, idOrFnDone, optFnDone) {
    var done, id, queue;
    urls = urls.push ? urls : [urls];
    queue = urls.length;
    if (idOrFnDone.call) {
      done = idOrFnDone;
      id = urls.join("");
    } else {
      done = optFnDone;
      id = idOrFnDone;
    }
    if (scriptIds[id]) {
      return;
    }
    timeout(function() {
      var fn;
      fn = function(item) {
        if (item.call) {
          return item();
        } else {
          return list[item];
        }
      };
      each(urls, function(url) {
        var element, loaded;
        if (scriptUrls[url]) {
          return;
        }
        scriptUrls[url] = scriptIds[id] = 1;
        element = document.createElement("script");
        loaded = 0;
        element.onload = element.onreadystatechange = function() {
          var dset;
          if ((element.readyState && element.readyState !== "complete") || loaded) {
            return;
          }
          element.onload = element.onreadystatechange = null;
          loaded = 1;
          if (!--queue) {
            list[id] = true;
            done && done();
            for (dset in delay) {
              all(dset.split("|"), fn) && !each(delay[dset], fn) && (delay[dset] = []);
            }
          }
        };
        element.async = 1;
        element.src = url;
        firstScriptElement.parentNode.insertBefore(element, firstScriptElement);
      });
    }, 0);
    return $script;
  };
  $script.ready = function(deps, ready, req) {
    var key, missing;
    deps = deps.push ? deps : [deps];
    missing = [];
    if (!each(deps, function(dep) {
      return list[dep] || missing.push(dep);
    }) && all(deps, function(dep) {
      return list[dep];
    })) {
      ready();
    } else {
      key = deps.join("|");
      delay[key] || (delay[key] = []);
      delay[key].push(ready);
      req && req(missing);
    }
    return $script;
  };
  $script.domReady = function(fn) {
    document.readyState === "complete" ? fn(): timeout(function() {$script.domReady(fn); }, 20);;
  };
  return $script;
})(this, document, setTimeout);
