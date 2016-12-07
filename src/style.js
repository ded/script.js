function $style(css) {
  var elem=document.createElement('style');
  if(elem.styleSheet && !elem.sheet)
    elem.styleSheet.cssText=css;
  else
    elem.appendChild(document.createTextNode(css));
  document.getElementsByTagName('head')[0].appendChild(elem);
}

//usage:
//
//$style("@import url('/stylesheets/orders.css');");
//$style("@import url('http://123.123.123.123:5051/stylesheets/orders.css');");
//$style('.example {'+
//       ' width : 90%;'+
//       '  height: 90%;'+
//       '  margin: 8px auto;'+
//       '} '+
//       //+'.item{border:1px solid lightgray;padding:10px;}'+
//       '')
