var total = 0,
    testing = false,
    fail = false;
function ok(b, message) {
  if (b) {
    total--;
  } else {
    fail = true;
  }
}
function reset() {
  total = 0;
  fail = false;
  testing = false;
}
function failure(li, check) {
  check.innerHTML = 'x';
  li.className = 'fail';
  reset();
}
function pass(li, check) {
  check.innerHTML = '✓';
  li.className = 'pass';
  reset();
}
function test(name, expect, fn) {
  if (testing) {
    return setTimeout(function() {
      test(name, expect, fn);
    }, 100);
  }
  testing = true;
  total = expect;
  var li = document.createElement('li');
  li.innerHTML = name + ' ... <span>o</span>';
  var start = +new Date;
  var check = li.getElementsByTagName('span')[0];
  document.getElementById('tests').appendChild(li);
  fn();
  setTimeout(function() {
    if (+new Date - start > 10000) {
      failure(li, check);
    } else {
      if (fail) {
        failure(li, check);
      } else if (!total) {
        pass(li, check);
      } else {
        setTimeout(arguments.callee, 300);
      }
    }
  }, 300);
}
