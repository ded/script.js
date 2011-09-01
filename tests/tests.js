script('../build/domready/ready.js', function () {

  domReady(function() {

    sink('no conflict', function (test, ok) {
      test('should return old $script back to context', 1, function () {
        ok($script() == 'success', 'old $script called');
      });
    });

    sink('Basic', function(test, ok, before, after) {

      test('should call from chained ready calls', 4, function() {

        script.ready('jquery', function() {
          ok(true, 'loaded from ready callback');
        });

        script.ready('jquery', function() {
          ok(true, 'called jquery callback again');
        })
          .ready('jquery', function() {
            ok(true, 'called ready on a chain');
          });

        script('../vendor/jquery.js', 'jquery', function() {
          ok(true, 'loaded from base callback');
        });

      });

      test('multiple files can be loaded at once', 1, function() {
        script(['../demos/js/foo.js', '../demos/js/bar.js'], function() {
          ok(true, 'foo and bar have been loaded');
        });
      });

      test('ready should wait for multiple files by name', 1, function() {
        script(['../demos/js/baz.js', '../demos/js/thunk.js'], 'bundle').ready('bundle', function() {
          ok(true, 'batch has been loaded');
        });
      });

      test('ready should wait for several batches by name', 1, function() {
        script('../vendor/yui-utilities.js', 'yui');
        script('../vendor/mootools.js', 'moomoo');
        script.ready(['yui', 'moomoo'], function() {
          console.log('ONCE');
          ok(true, 'multiple batch has been loaded');
        });
      });

      test('ready should not call a duplicate callback', 1, function() {
        script.ready(['yui', 'moomoo'], function() {
          console.log('TWICE');
          ok(true, 'found yui and moomoo again');
        });
      });

      test('ready should not call a callback a third time', 1, function() {
        script.ready(['yui', 'moomoo'], function() {
          console.log('THREE');
          ok(true, 'found yui and moomoo again');
        });
      });

      test('should load a single file without extra arguments', 1, function () {
        var err = false;
        try {
          script('../vendor/yui-utilities.js');
        } catch (ex) {
          err = true;
          console.log('wtf ex', ex);
        } finally {
          ok(!err, 'no error');
        }
      });

      test('should callback a duplicate file without loading the file', 1, function () {
        script('../vendor/yui-utilities.js', function () {
          ok(true, 'loaded yui twice. nice');
        });
      });

      test('onerror', 1, function () {
        script('waaaaaaaaaaaa', function () {
          ok(true, 'no waaaa');
        });
      });

    });

    sink('CSS Loading', function (test, ok) {
      // This test currently only works in Chrome and Safari
      // See http://www.phpied.com/when-is-a-stylesheet-really-loaded/
      test('should load css content', 1, function () {
        var sheets = document.styleSheets,
            len = sheets.length,
            count = 0,
            ti;
        script.styles('../demos/css/demos.css');
        // Check if styles are loaded each second
        ti = setInterval(function() {
          // Loop through only the newly added stylesheets
          for (var i=sheets.length; i>len; i--) {
            if (sheets[i-1].href.indexOf('demos/css/demos.css') != -1) {
              ok(true, 'css loaded');
              clearInterval(ti);
            }
          }
          // Give up after 10 tries
          ++count > 10 && clearInterval(ti);
        },1000);
      });
    });

    start();
  });
});