var fs = require('fs');
var jquery = require('jquery');
var jsdom = require("./build/jsdom");
var f = fs.readFileSync("./tests/test.html", 'utf8');

var window = jsdom.jsdom(f, null, {
    FetchExternalResources   : ['script'],
    ProcessExternalResources : true
}).createWindow();

var $ = jquery.create(window);
console.log(window.document.body.innerHTML);
setTimeout(function () {
  console.log($('body').html());
}, 1000);

