#!/usr/bin/env node
// building $script.js requires node
// to install node try "port install node"
// if that doesn't work. see the instructions
// https://github.com/ry/node/wiki/Installation
var fs = require('fs'),
    uglifyJs = require('./build/UglifyJS'),
    jshint = require('./build/jshint/jshint').JSHINT,

    BUILD_DIR   = 'build',
    DIST_DIR    = 'dist',
    SRC_DIR     = 'src',

    jshint_opts = {boss: true, forin: true, browser: true};

console.log("Loading $script source...");

var $script = fs.readFileSync(SRC_DIR + '/script.js', 'UTF-8'),
    header = fs.readFileSync(SRC_DIR + '/header.js', 'UTF-8');

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
var $scriptUgly = uglifyJs.uglify.gen_code(ast);

console.log('$script minified with UglifyJs');

try {
  fs.statSync(DIST_DIR);
} catch (e) {
  fs.mkdirSync(DIST_DIR, 0775);
}

var $uglyFile = [header, $scriptUgly].join('');
fs.writeFileSync(DIST_DIR + '/script.js', [header, $script].join('\n'));
fs.writeFileSync(DIST_DIR + '/script.min.js', $uglyFile);

var oldLen = $oldFile.length,
    newLen = $uglyFile.length,
    fileDiff = Math.abs(oldLen - newLen);
console.log("Done! $script.js is now " + newLen + ' bytes.');
if (newLen < oldLen) {
  console.log('You are a very special, handsome person. Now go do a shot of whiskey');
  console.log('That\'s ' + fileDiff + ' bytes less!');
} else if (newLen < oldLen) {
  console.log('Dude! You made it worse!');
  console.log('That\'s ' + fileDiff + ' bytes more!');
} else {
  console.log('Not bad. But how does it feel to do all that work and make no difference');
}