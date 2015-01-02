/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

  /*!
   * With permissions from @ded to enable this module load css files asynchrnously as well
   * $script.js JS dependency manager & CSS loader 
   */
(function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else this[name] = definition()
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
	, all = doc.getElementsByTagName('script')
	, thisfile = all[all.length - 1]
	, tpath = thisfile.src
	, loaderPath = thisfile.getAttribute('setup-main')
    , s = 'string'
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , ids = {}
    , delay = {}
    , scripts = {}
    , scriptpath // = tpath.substring(0, tpath.lastIndexOf('/')+1)
    , urlArgs
	, cwdRgx = /^(\.(?=\/)|[^\.\/]+?\.[a-z]{2,4})/i
	, tagMap = {
	    "js":"script",
		"css":"link",
		"":"undefined"
	 }
	 
	 console.log("s: "+scriptpath);

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      return !fn(el)
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
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
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        path = !force && path.indexOf('.js') === -1 && !/^https?:\/\//.test(path) && scriptpath ? scriptpath + path + '.js' : path
        if (scripts[path]) {
          if (id) ids[id] = 1
          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
        }

        scripts[path] = 1
        if (id) ids[id] = 1
        create(path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var isStr = path.toString() === path,
	    el = path.nodeType && path || isStr && doc.createElement(tagMap[(path.match(/\.(js|css)$/i) || ["",""])[1]]), 
	    type = el.nodeName.toLowerCase(),
	    loaded;
	 if(type == "undefined") return;
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn && fn()
    }
    switch(type){
	  case "script":
	   el.type = "text/javascript";
	   el.async = isStr ? 1 : false ;
	   path = isStr ? path : tpath ;
       el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
	  break;
	  case "link":
	   el.type = "text/css";
	   el.rel = "stylesheet";
	   el.href = path;
	  break; 
	}	
    if(isStr) head.insertBefore(el, head.lastChild)
  }

  $script.get = function(s, done){
     create(String(s), done)
  }	 

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      !scripts.length ? $script(s, id, done) : $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.urlArgs = function (str) {
    urlArgs = str;
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return this;
  }

  $script.done = function (idOrDone) {
    this([null], idOrDone)
  }
  
  create(thisfile, function(){
    create(loaderPath);
  });
  
  return $script
});
