#!/usr/bin/env node

var fs = require('fs'),
  uglifyJs = require('./build/UglifyJS');

BUILD_DIR   = 'build',
DIST_DIR    = 'dist',
SRC_DIR     = 'src',

console.log("Loading $script source...");

var $script = fs.readFileSync(SRC_DIR + '/script.js', 'UTF-8'),
    header = fs.readFileSync(SRC_DIR + '/header.js', 'UTF-8');

var ast = uglifyJs.parser.parse($script); // parse code and get the initial AST
ast = uglifyJs.uglify.ast_mangle(ast); // get a new AST with mangled names
ast = uglifyJs.uglify.ast_squeeze(ast); // get an AST with compression optimizations
var $script_ugly = uglifyJs.uglify.gen_code(ast);

console.log('$script minified with UglifyJs');

try {
  fs.statSync(DIST_DIR);
} catch (e) {
  fs.mkdirSync(DIST_DIR, 0775);
}

// Without plugins
fs.writeFileSync(DIST_DIR + '/script.js', [header, $script].join('\n'));
fs.writeFileSync(DIST_DIR + '/script.min.js', [header, $script_ugly].join(''));

console.log("Finished!");
