!function (win, doc, timeout) {
  var head = doc.getElementsByTagName('head')[0],
      list = {}, ids = {}, delay = {}, scripts = {},
      s = 'string', f = false, push = 'push',
      domContentLoaded = 'DOMContentLoaded', readyState = 'readyState',
      addEventListener = 'addEventListener', onreadystatechange = 'onreadystatechange',
      faux = doc.createElement('script'),
      preloadExplicit = typeof faux.preload == 'boolean',
      preloadReal = preloadExplicit || (faux[readyState] && faux[readyState] == 'uninitialized'),
      async = !preloadReal && faux.async === true

  if (!doc[readyState] && doc[addEventListener]) {
    doc[addEventListener](domContentLoaded, function fn() {
      doc.removeEventListener(domContentLoaded, fn, f);
      doc[readyState] = 'complete';
    }, f);
    doc[readyState] = 'loading';
  }

  function every(ar, fn, i) {
    for (i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1;
  }

  function each(ar, fn) {
    every(ar, function (el) {
      return !fn(el);
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call,
        workingPaths = paths.slice(0), loadedPaths = {},
        done = idOrDoneIsDone ? idOrDone : optDone,
        id = idOrDoneIsDone ? paths.join('') : idOrDone,
        queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    timeout(function () {
      each(paths, function (path, p) {
        p = $script.path ? $script.path + path + '.js' : path
        if (scripts[path]) {
          ids[id] = id || f
          return callback()
        }
        scripts[path] = 1
        ids[id] = id || f
        // preload(p, function (el) {
        !$script.order ? create(p, callback) : preload(p, function (el) {
          if (async) return callback()
          el && head.insertBefore(el, head.firstChild)
          loadedPaths[p] = 1
          workingPaths[0] == p && create(p, callback)
          workingPaths.shift()
          while (loadedPaths[workingPaths[0]]) {
            create(workingPaths[0], callback)
            workingPaths.shift()
          }
        })
      })
    }, 0)
    return $script
  }

  function create(path, fn, type) {
    var el = doc.createElement('script'), loaded = f
    console.log('create("' + path + '")');
    el.type = type || 'text/javascript'
    el.async = !$script.order
    el.onload = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return
      el.onload = el[onreadystatechange] = null
      loaded = 1
      fn && fn()
    }
    el.src = path
    head.insertBefore(el, head.firstChild)
  }

  function preload(path, fn, el) {
    el = doc.createElement('script')
    if (preloadReal) {
      if (preloadExplicit) {
        el.preload = true
        el.onpreload = function () {
          fn(el)
        }
      } else {
        el[onreadystatechange] = function(){
          el[readyState] == 'loaded' && fn(el)
          el[onreadystatechange] = null
        }
      }
      script.src = path
    } else if (async) {
      create(path, fn)
    } else {
      create(path, fn, 'text/cache-script')
    }
  }

  $script.get = create
  $script.order = true

  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = []
    !each(deps, function (dep) {
      list[dep] || missing[push](dep)
    }) && every(deps, function (dep) {
      return list[dep]
    }) ? ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  };

  var old = win.$script;
  $script.noConflict = function () {
    win.$script = old;
    return this;
  };

  (typeof module !== 'undefined' && module.exports) ?
    (module.exports = $script) :
    (win['$script'] = $script);

}(this, document, setTimeout);
