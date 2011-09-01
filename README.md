$script.js - Asynchronous JavaScript loader and dependency manager
------------------------------------------------------------------

$script.js is an asynchronous JavaScript loader and dependency manager with an astonishingly impressive lightweight footprint (currently 800 bytes! (min + gzip)). Like many other script loaders, $script.js allows you to load script resources on-demand from any URL and not block other resources from loading (like CSS and images). Furthermore, it's unique interface allows developers to work easily with even the most complicated dependencies, which can often be the case for large, complex web applications.

Browser Support
---------------
  * IE 6, 7, 8, 9
  * Opera 10, 11
  * Safari 3, 4, 5
  * Chrome 9, 10, beta
  * Firefox 2, 3, beta
  * Lynx (just kidding)

Examples
--------

old school - blocks CSS, Images, AND JS!

``` html
<script src="jquery.js"></script>
<script src="my-jquery-plugin.js"></script>
<script src="my-app-that-uses-plugin.js"></script>
```

middle school - loads as non-blocking, but has multiple dependents

``` js
$script('jquery.js', function() {
  $script('my-jquery-plugin.js', function() {
    $script('my-app-that-uses-plugin.js');
  });
});
```

new school - loads as non-blocking, and ALL js files load asynchronously

``` js
// load jquery and plugin at the same time. name it 'bundle'
$script(['jquery.js', 'my-jquery-plugin.js'], 'bundle');

// load your usage
$script('my-app-that-uses-plugin.js');


/*--- in my-jquery-plugin.js ---*/
$script.ready('bundle', function() {
  // jquery & plugin (this file) are both ready
  // plugin code...
});


/*--- in my-app-that-uses-plugin.js ---*/
$script.ready('bundle', function() {
  // use your plugin :)
});
```

Exhaustive list of ways to use $script.js
-----------------------------------------

``` js
$script('foo.js', function() {
  // foo.js is ready
});


$script(['foo.js', 'bar.js'], function() {
  // foo.js & bar.js is ready
});


$script(['foo.js', 'bar.js'], 'bundle');
$script.ready('bundle', function() {
  // foo.js & bar.js is ready
});


$script('foo.js', 'foo');
$script('bar.js', 'bar');
$script
  .ready('foo', function() {
    // foo.js is ready
  })
  .ready('bar', function() {
    // bar.js is ready
  });


var dependencyList = {
  foo: 'foo.js',
  bar: 'bar.js',
  thunk: ['thunkor.js', 'thunky.js']
};

$script('foo.js', 'foo');
$script('bar.js', 'bar');

// wait for multiple depdendencies!
$script.ready(['foo', 'bar', 'thunk'], function() {
  // foo.js & bar.js & thunkor.js & thunky.js is ready
}, function(depsNotFound) {
    // foo.js & bar.js may have downloaded
    // but ['thunk'] dependency was never found
    // so lazy load it now
    depsNotFound.forEach(function(dep) {
      $script(dependencyList[dep], dep);
    });
  });
```

$script.path
------------
Optionally to make working with large projects easier, there is a path variable you can set to set as a base.

``` js
$script.path = '/js/modules/';
$script(['dom', 'event'], function () {
  // use dom & event
});
```

Note that this will include all scripts from here on out with the base path. If you wish to circumvent this for any single script, you can simply call <code>$script.get()</code>

``` js
$script.path = '/js/modules/';
$script(['dom', 'event'], function () {
  // use dom & event
});

$script.get('http://example.com/base.js', function () {

});
```

$script.styles
--------------
A very simple stylesheet loader is provided. This loader does not provide any sort of callback
when the sheet is loaded, nor does it report any sort of errors. It simply loads whatever URL
is specified, adding a `<link>` tag at the end of the the page's `<head>`. Usage example:

``` js
var link = $script.styles('/css/styles.css');
```

If you need to know when the stylesheet is loaded, the `<link>` DOM element that is created 
is returned for your use. Information on how to determine when a stylesheet has been loaded 
can be found at the URL below. If you are having flash-of-content problems, this might help:
http://www.phpied.com/when-is-a-stylesheet-really-loaded/

Callbacks and error handling for CSS have been left out of $script as it would add a 
significant amount of bloat the $script to support all browsers. Keeping $script lightweight
is more important at this time. 

Building $script.js
-------------------
Building $script.js requires Node. To build, just run:

    $ make

The copies of $script.js & $script.min.js that are in the dist folder will be overwritten with the newly built copies. The minified version of $script is compressed with [UglifyJS](https://github.com/mishoo/UglifyJS "UglifyJS").

*Note: you must init the UglifyJS submodule before running the makefile. To do this run:*

    $ git submodule update --init

Common JS Support - added in v1.2
-----------------

Several folks have asked about [Common JS Module](http://commonjs.org) support. It's a bit unclear why this support is needed since $script itself can load files, and more than likely you're already loading your dependencies with something like [RequireJS](http://requirejs.org/). However it's also unknown what any given developer can be doing with $script, like for example injecting it into their existing headless unit testing framework -- therefore as of v1.2, $script will export itself as a module rather than exposing itself to the browser _window_ object.

``` js
var $S = require('script');

$S('/foo.js', function () {
  // foo is ready
});
```

Contributors
------------
  * [Dustin Diaz](https://github.com/ded/script.js/commits/master?author=ded)
  * [Jacob Thornton](https://github.com/ded/script.js/commits/master?author=fat)