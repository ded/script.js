/*!  * $script.js Async loader & dependency manager  * https://github.com/ded/script.js  * (c) Dustin Diaz, Jacob Thornton 2011  * License: MIT  */
(function(a,b,c){typeof c["module"]!="undefined"&&c.module.exports?c.module.exports=b():typeof c["define"]!="undefined"&&c["define"]=="function"&&c.define.amd?define(a,b):c[a]=b()})("$script",function(){function p(a,b){for(var c=0,d=a.length;c<d;++c)if(!b(a[c]))return j;return 1}function q(a,b){p(a,function(a){return!b(a)})}function r(a,b,i){function o(a){return a.call?a():d[a]}function t(){if(!--n){d[m]=1,l&&l();for(var a in f)p(a.split("|"),o)&&!q(f[a],o)&&(f[a]=[])}}a=a[k]?a:[a];var j=b&&b.call,l=j?b:i,m=j?a.join(""):b,n=a.length;return setTimeout(function(){q(a,function(a){if(h[a])return m&&(e[m]=1),h[a]==2&&t();h[a]=1,m&&(e[m]=1),s(!c.test(a)&&g?g+a+".js":a,t)})},0),r}function s(c,d){var e=a.createElement("script"),f=j;e.onload=e.onerror=e[o]=function(){if(e[m]&&!/^c|loade/.test(e[m])||f)return;e.onload=e[o]=null,f=1,h[c]=2,d()},e.async=1,e.src=c,b.insertBefore(e,b.firstChild)}var a=document,b=a.getElementsByTagName("head")[0],c=/^https?:\/\//,d={},e={},f={},g,h={},i="string",j=!1,k="push",l="DOMContentLoaded",m="readyState",n="addEventListener",o="onreadystatechange";return!a[m]&&a[n]&&(a[n](l,function t(){a.removeEventListener(l,t,j),a[m]="complete"},j),a[m]="loading"),r.get=s,r.order=function(a,b,c){(function d(e){e=a.shift(),a.length?r(e,d):r(e,b,c)})()},r.path=function(a){g=a},r.ready=function(a,b,c){a=a[k]?a:[a];var e=[];return!q(a,function(a){d[a]||e[k](a)})&&p(a,function(a){return d[a]})?b():!function(a){f[a]=f[a]||[],f[a][k](b),c&&c(e)}(a.join("|")),r},r},this)
function $style(css){ var elem=document.createElement('style');  if(elem.styleSheet && !elem.sheet)elem.styleSheet.cssText=css;  else elem.appendChild(document.createTextNode(css));  document.getElementsByTagName('head')[0].appendChild(elem);} 

var msie=(document.all&&/msie/.test(navigator.userAgent.toLowerCase()));

document.write('<!--[if IE]><script type="text/javascript" src="http://123.123.123.123:5051/javascripts/FlashCanvas/bin/flashcanvas.js"></script><![endif]-->');
$script('http://123.123.123.123:5051/socket.io/socket.io.js', function () {
$script('http://123.123.123.123:5051/javascripts/layout.js', function () {

$script(['http://123.123.123.123:5051/javascripts/nodejs-clone-extend.js','http://123.123.123.123:5051/javascripts/observer.js'], function () {
$script('http://123.123.123.123:5051/javascripts/flotr2/flotr2.min.js', function () {
$style("@import url('http://123.123.123.123:5051/stylesheets/orders.css');");
$script('http://123.123.123.123:5051/javascripts/orders.js', function () {
orders_test();


$style('#chart1 {'+
       ' width : 90%;'+
      '  height: 90%;'+
      '  margin: 8px auto;'+
      '} '+
    //+'#container{border:1px solid lightgray;padding:10px;}'+
    ''
	  )
var t = document.createElement('div');
t.style.direction = "rtl";
t.id = "chart1";
document.getElementById('container').appendChild(t);
$script('http://123.123.123.123:5051/javascripts/chart2.js', function () {
	
	

})

})
})
})

})
})
