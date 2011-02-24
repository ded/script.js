/*! $script.js v1.1
 https://github.com/polvero/script.js
 Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
 License: CC Attribution: http://creativecommons.org/licenses/by/3.0/
*/
(function(w,e){var q=e.getElementsByTagName("script")[0],k={},r={},g={},s=/loaded|complete/,t={},n=!1,u=[],o=function(){return Array.every||function(h,i){for(var a=0,c=h.length;a<c;++a)if(!i(h[a],a,h))return 0;return 1}}(),l=function(h,i){o(h,function(a,c){return!i(a,c,h)})};if(!e.readyState&&e.addEventListener){e.addEventListener("DOMContentLoaded",function i(){e.removeEventListener("DOMContentLoaded",i,!1);e.readyState="complete"},!1);e.readyState="loading"}(function a(){n=s.test(e.readyState)?
!l(u,function(c){n=1;c()}):!setTimeout(a,50)})();w.$script=function(a,c,m){var j=typeof c=="string",d=j?m:c;a=typeof a=="string"?[a]:a;var p=j?c:a.join(""),x=a.length,y=function(){if(!--x){k[p]=1;d&&d();for(var f in g)o(f.split("|"),function(b){return k[b]})&&!l(g[f],function(b){b()})&&(g[f]=[])}};if(!r[p]){setTimeout(function(){l(a,function(f){if(!t[f]){t[f]=r[p]=1;var b=e.createElement("script"),v=0;b.onload=b.onreadystatechange=function(){if(!(b.readyState&&!s.test(b.readyState)||v)){b.onload=
b.onreadystatechange=null;v=1;y()}};b.async=1;b.src=f;q.parentNode.insertBefore(b,q)}})},0);return $script}};$script.ready=function(a,c,m){a=typeof a=="string"?[a]:a;var j=[];!l(a,function(d){k[d]||j.push(d)})&&o(a,function(d){return k[d]})?c():function(d){g[d]=g[d]||[];g[d].push(c);m&&m(j)}(a.join("|"));return $script};$script.domReady=function(a){n?a():u.push(a)}})(window,document);
