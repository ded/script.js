/**
 * $script.js v1.1
 * https://github.com/polvero/script.js
 * Copyright: @ded & @fat
 * Dustin Diaz, Jacob Thornton 2011
 * License: Creative Commons Attribution: http://creativecommons.org/licenses/by/3.0/
 */

(function(win, doc) {
  var script = doc.getElementsByTagName("script")[0],
      list = {}, ids = {}, delay = {}, re = /loaded|complete/,
      scripts = {}, s = 'string', f = false, domReady = f, readyList = [],
      domContentLoaded = 'DOMContentLoaded', readyState = 'readyState',
      addEventListener = 'addEventListener',
      every = function() {
        return Array.every || function(ar, fn) {
          for (var i=0, j=ar.length; i < j; ++i) {
            if (!fn(ar[i], i, ar)) {
              return 0;
            }
          }
          return 1;
        };
      }(),
      each = function(ar, fn) {
        every(ar, function(el, i) {
          return !fn(el, i, ar);
        });
      };
  if (!doc[readyState] && doc[addEventListener]) {
    doc[addEventListener](domContentLoaded, function fn() {
      doc.removeEventListener(domContentLoaded, fn, f);
      doc[readyState] = "complete";
    }, f);
    doc[readyState] = "loading";
  }

  (function l() {
    domReady = re.test(doc[readyState]) ? !each(readyList, function(f) {
      domReady = 1;
      f();
    }) : !setTimeout(l, 50);
  }());

  win.$script = function(paths, idOrDone, optDone) {
    var idOrDoneIsId = typeof idOrDone == s,
        done = idOrDoneIsId ? optDone : idOrDone,
        paths = typeof paths == s ? [paths] : paths,
        id = idOrDoneIsId ? idOrDone : paths.join(''),
        queue = paths.length,
        callback = function() {
          if (!--queue) {
            list[id] = 1;
            done && done();
            for (var dset in delay) {
              every(dset.split('|'), function(file) {
                return (list[file]);
              }) && !each(delay[dset], function(fn) {
                fn();
              }) && (delay[dset] = [])
            }
          }
        };
    if (ids[id]) {
      return;
    }
    setTimeout(function() {
      each(paths, function(path) {
        if (scripts[path]) {
          return;
        }
        scripts[path] = ids[id] = 1;
        var el = doc.createElement("script"),
            loaded = 0;
        el.onload = el.onreadystatechange = function () {
          if ((el[readyState] && !(re.test(el[readyState]))) || loaded) {
            return;
          }
          el.onload = el.onreadystatechange = null;
          loaded = 1;
          callback();
        };
        el.async = 1;
        el.src = path;
        script.parentNode.insertBefore(el, script);
      });
    }, 0);
    return $script;
  }
  $script.ready = function(deps, ready, req) {
    deps = (typeof deps == s) ? [deps] : deps;
    var missing = [];
    !each(deps, function(dep) {
      (list[dep]) || missing.push(dep);
    }) && every(deps, function(dep) {
      return (list[dep]);
    }) ? ready() : (function(key) {
      delay[key] = delay[key] || [];
      delay[key].push(ready);
      req && req(missing);
    }(deps.join('|')));
    return $script;
  };
  $script.domReady = function(fn) {
    domReady ? fn() : readyList.push(fn);
  };
}(window, document));
