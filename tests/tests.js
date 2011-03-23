$script.domReady(function() {
  sink('Basic', function(test, ok, before, after) {

    test('document ready should fire even after doc has been loaded', 1, function() {
      $script.domReady(function() {
        ok(true, 'loaded');
      });
    });

    test('should call from chained ready calls', 5, function() {

      $script.domReady(function() {
        ok(true, 'dom loaded');
      });

      $script.ready('jquery', function() {
        ok(true, 'loaded from ready callback');
      });

      $script.ready('jquery', function() {
        ok(true, 'called jquery callback again');
      })
        .ready('jquery', function() {
          ok(true, 'called ready on a chain');
        });

      $script('../vendor/jquery.js', 'jquery', function() {
        ok(true, 'loaded from base callback');
      });

    });

    test('multiple files can be loaded at once', 1, function() {
      $script(['../demos/js/foo.js', '../demos/js/bar.js'], function() {
        ok(true, 'foo and bar have been loaded');
      });
    });

    test('ready should wait for multiple files by name', 1, function() {
      $script(['../demos/js/baz.js', '../demos/js/thunk.js'], 'bundle').ready('bundle', function() {
        ok(true, 'batch has been loaded');
      });
    });

    test('ready should wait for several batches by name', 1, function() {
      $script('../vendor/yui-utilities.js', 'yui');
      $script('../vendor/mootools.js', 'moomoo');
      $script.ready(['yui', 'moomoo'], function() {
        console.log('ONCE');
        ok(true, 'multiple batch has been loaded');
      });
    });

    test('ready should not call a duplicate callback', 1, function() {
      $script.ready(['yui', 'moomoo'], function() {
        console.log('TWICE');
        ok(true, 'found yui and moomoo again');
      });
    });

    test('ready should not call a callback a third time', 1, function() {
      $script.ready(['yui', 'moomoo'], function() {
        console.log('THREE');
        ok(true, 'found yui and moomoo again');
      });
    });
  });
  start();
});