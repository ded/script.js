/*! $script.js v1.1
https://github.com/polvero/script.js
Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011
License: CC Attribution: http://creativecommons.org/licenses/by/3.0/
*/!function(a,b,c){function t(a){h.test(b[n])?c(function(){t(a)},50):a()}var d=b.getElementsByTagName("script")[0],e={},f={},g={},h=/in/,i={},j="string",k=!1,l="push",m="DOMContentLoaded",n="readyState",o="addEventListener",p="onreadystatechange",q=function(){return Array.every||function(a,b){for(var c=0,d=a.length;c<d;++c)if(!b(a[c],c,a))return 0;return 1}}(),r=function(a,b){q(a,function(c,d){return!b(c,d,a)})};!b[n]&&b[o]&&(b[o](m,function s(){b.removeEventListener(m,s,k),b[n]="complete"},k),b[n]="loading"),a.$script=function(a,j,k){a=a[l]?a:[a];var m=j.call,o=m?j:k,s=m?a.join(""):j,t=a.length,u=function(a){return a.call?a():e[a]},v=function(){if(!--t){e[s]=1,o&&o();for(var a in g)q(a.split("|"),u)&&!r(g[a],u)&&(g[a]=[])}};if(!f[s]){c(function(){r(a,function(a){if(!i[a]){i[a]=f[s]=1;var c=b.createElement("script"),e=0;c.onload=c[p]=function(){c[n]&&!!h.test(c[n])||e||(c.onload=c[p]=null,e=1,v())},c.async=1,c.src=a,d.parentNode.insertBefore(c,d)}})},0);return $script}},$script.ready=function(a,b,c){a=a[l]?a:[a];var d=[];!r(a,function(a){e[a]||d[l](a)})&&q(a,function(a){return e[a]})?b():!function(a){g[a]=g[a]||[],g[a][l](b),c&&c(d)}(a.join("|"));return $script},a.$script.domReady=t}(this,document,setTimeout)