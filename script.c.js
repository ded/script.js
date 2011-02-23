/*!
 * $script.js v1.1
 * http://dustindiaz.com/scriptjs
 * Copyright: Dustin Diaz 2011
 * License: Creative Commons Attribution: http://creativecommons.org/licenses/by/3.0/
 */(function(x,e){var q=e.getElementsByTagName("script")[0],l={},r={},g={},s=function(){},t=/loaded|complete/,u={},n=!1,v=[],o=function(){return Array.every||function(h,i){for(var a=0,c=h.length;a<c;++a)if(!i(h[a],a,h))return 0;return 1}}(),m=function(h,i){o(h,function(a,c){return!i(a,c,h)})};if(!e.readyState&&e.addEventListener){e.addEventListener("DOMContentLoaded",function i(){e.removeEventListener("DOMContentLoaded",i,!1);e.readyState="complete"},!1);e.readyState="loading"}(function a(){n=t.test(e.readyState)?
!m(v,function(c){n=1;c()}):!setTimeout(a,50)})();x.$script=function(a,c,j){var k=typeof c=="string",d=(k?j:c)||s;a=typeof a=="string"?[a]:a;var p=k?c:a.join(""),y=a.length,z=function(){if(!--y){l[p]=1;d();for(var f in g)o(f.split("|"),function(b){return l[b]})&&!m(g[f],function(b){b()})&&(g[f]=[])}};if(!r[p]){setTimeout(function(){m(a,function(f){if(!u[f]){u[f]=r[p]=1;var b=e.createElement("script"),w=0;b.onload=b.onreadystatechange=function(){if(!(b.readyState&&!t.test(b.readyState)||w)){b.onload=
b.onreadystatechange=null;w=1;z()}};b.async=1;b.src=f;q.parentNode.insertBefore(b,q)}})},0);return $script}};$script.ready=function(a,c,j){j=j||s;a=typeof a=="string"?[a]:a;var k=[];!m(a,function(d){l[d]||k.push(d)})&&o(a,function(d){return l[d]})?c():function(d){g[d]=g[d]||[];g[d].push(c);j(k)}(a.join("|"));return $script};$script.domReady=function(a){n?a():v.push(a)}})(window,document);
