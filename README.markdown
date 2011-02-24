$script.js - Asynchronous JavaScript loader and dependency manager
------------------------------------------------------------------

Copyright: [@ded](http://twitter.com/ded "@ded"). & [@fat](http://twitter.com/fat "@fat"). 2011  
Dustin Diaz [http://dustindiaz.com](http://dustindiaz.com "http://dustindiaz.com")  
Jacob Thornton [http://hellomynameisjacob.com](http://hellomynameisjacob.com "http://hellomynameisjacob.com")  
License: Creative Commons Attribution: [http://creativecommons.org/licenses/by/3.0/](http://creativecommons.org/licenses/by/3.0/ "http://creativecommons.org/licenses/by/3.0/")  

$script.js is an asynchronous JavaScript loader and dependency manager with an astonishingly impressive lightweight footprint (currently 698 bytes! (min + gzip)). Like many other script loaders, $script.js allows you to load script resources on-demand from any URL and not block other resources from loading (like CSS and images). Furthermore, it's unique interface allows developers to work easily with even the most complicated dependencies, which can often be the case for large, complex web applications.

Browser Support
---------------
    IE 6, 7, 8, 9
    Opera 10, 11
    Safari 3, 4, 5
    Chrome 9, 10, beta
    Firefox 2, 3, beta
    Lynx (just kidding)

Examples
--------

old school - blocks CSS, Images, AND JS!

    <script src="jquery.js"></script>
    <script src="my-jquery-plugin.js"></script>
    <script src="my-app-that-uses-plugin.js"></script>


middle school - loads as non-blocking, but has multiple dependents

    $script('jquery.js', function() {
      $script('my-jquery-plugin.js', function() {
        $script('my-app-that-uses-plugin.js');
      });
    });

new school - loads as non-blocking, and ALL js files load asynchronously

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


Exhaustive list of ways to use $script.js
-----------------------------------------
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

Added in v1.1
-------------
Since many scripts on the web depend on document ready (DOMContentLoaded), loading them with $script.js may lead to a race condition where the document will have already loaded after your script loads (because $script.js is so fast!), yielding your document ready callbacks useless. Thus $script.js has added a new method on the $script object call *domReady*. It works like this:

    <head>
      <script>
      $script('10-metabytes.js', function() {
        // use after a library has been loaded
        $script.domReady(function() {
          // your code here
        });
      });

      // or use independently
      $script.domReady(function() {
        // dom has loaded
      });
      </script>
    </head>
    <body>
      ...
    </body>

Reason for $script.domReady
---------------------------
The reason why $script.js exposes a domReady method rather than *fixing DOMContentLoaded* is that it's not necessarily the responsibility of this utility to do it. There are literally hundreds of implementations on the internet of what "DOM Ready" means, and by no stretch will I attempt to make sure $script works with them all. Hence the most we can provide is yet another (small & simple) way to let users hook into when the DOM is ready.

Building $script.js
-------------------
Building $script.js requires NodeJS to be installed. To build, just run:

    node Makefile.js

The copies of $script.js & $script.min.js that are in the dist folder will be overwritten with the newly built copies. The minified version of $script is compressed with [UglifyJS](https://github.com/mishoo/UglifyJS "UglifyJS").

*Note: you must init the UglifyJS submodule before running the makefile. To do this run:*

    git submodule init
