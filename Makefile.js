#!/usr/bin/env node
// building $script.js requires node
// to install node try "port install node"
// if that doesn't work. see the instructions
// https://github.com/ry/node/wiki/Installation
var fs = require('fs'),
    uglifyJs = require('./build/UglifyJS'),
    jshint = require('./build/jshint/jshint').JSHINT,
    gzip = require('./build/gzip/lib/gzip'),

    BUILD_DIR   = 'build',
    DIST_DIR    = 'dist',
    SRC_DIR     = 'src',

    jshint_opts = {boss: true, forin: true, browser: true};

console.log("Loading $script source...");

var $script = fs.readFileSync(SRC_DIR + '/script.js', 'UTF-8'),
    header = fs.readFileSync(SRC_DIR + '/header.js', 'UTF-8'),
    $requireScript = fs.readFileSync(SRC_DIR + '/script-commonjs.js', 'UTF-8');

console.log("Testing $script against jshint...");

jshint($script, jshint_opts);
var errors = [];
jshint.errors.forEach(function (err) {
  //ignore these errors until jshint resolves https://github.com/jshint/jshint/issues#issue/20
  if (err.reason != 'Expected an assignment or function call and instead saw an expression.') {
    errors.push(err);
  }
});

if (!errors.length) {
  console.log('Congratulations. You are a very special and handsome person. <3 JSHint.');
} else {
  console.log(
      'JSHint is NOT happy with '
      + errors.length
      + ' thing' + (errors.length > 1 ? 's' : '')
      + '!'
  );
  errors.forEach(function (err) {
    console.log(err.id + " line " + err.line + ": " + err.reason);
  });
  console.log('---------------------------------');
}

var $oldFile = fs.readFileSync(DIST_DIR + '/script.min.js', 'UTF-8');
var ast = uglifyJs.parser.parse($script); // parse code and get the initial AST
ast = uglifyJs.uglify.ast_mangle(ast); // get a new AST with mangled names
ast = uglifyJs.uglify.ast_squeeze(ast); // get an AST with compression optimizations

var ast_require = uglifyJs.parser.parse($requireScript); // parse code and get the initial AST
ast_require = uglifyJs.uglify.ast_mangle(ast_require); // get a new AST with mangled names
ast_require = uglifyJs.uglify.ast_squeeze(ast_require); // get an AST with compression optimizations


var $scriptUgly = uglifyJs.uglify.gen_code(ast);
var $requireUgly = uglifyJs.uglify.gen_code(ast_require);
console.log('$script minified with UglifyJs');

try {
  fs.statSync(DIST_DIR);
} catch (e) {
  fs.mkdirSync(DIST_DIR, 0775);
}

var $uglyFile = [header, $scriptUgly].join('');
var $uglyRequireFile = [header, $requireUgly].join('');
fs.writeFileSync(DIST_DIR + '/script.js', [header, $script].join('\n'));
fs.writeFileSync(DIST_DIR + '/script.min.js', $uglyFile);
fs.writeFileSync(DIST_DIR + '/script.commonjs.min.js', $uglyRequireFile);


//gzip everything
console.log('gzipping...');
gzip($oldFile, function(err, data){
  var oldLen = $oldFile.length,
    oldGzipLen = data.length;
    gzip($uglyFile, function(err, data){
      var newLen = $uglyFile.length,
      newGzipLen = data.length;
      messageLength(oldLen, oldGzipLen, newLen, newGzipLen);
    });
});

function messageLength(oldLen, oldGzipLen, newLen, newGzipLen){
  var fileDiff = Math.abs(oldLen - newLen),
    gzipDiff = oldGzipLen - newGzipLen,
    gzipMsg = '(' + Math.abs(gzipDiff) + ' ' + (gzipDiff < 0 ? 'more' : 'less') + ' gzipped.)';

  console.log("Done! $script.js is now " + newLen + ' bytes. (Only ' + newGzipLen + ' gzipped.)');
  if (newLen < oldLen) {
    console.log('You are a very special, handsome person. Now go do a shot of whiskey');
    console.log('That\'s ' + fileDiff + ' bytes less! ' + gzipMsg);
  } else if (newLen > oldLen) {
    console.log('Dude! You made it worse!');
    console.log('That\'s ' + fileDiff + ' bytes more! ' + gzipMsg);
  } else {
    console.log('Not bad. But how does it feel to do all that work and make no difference');
  }
};
