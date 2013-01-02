var orders={
render: 
{
        // this is noframework framework
        // the idea is that you create a holder then you fill it with html - ti is very simple, then set basic properties and append it
        groups_holder: function() {
            var t = document.createElement('div'); 
            t.id="groups_holder"
            //t.className = "groups_holder";
            //t.style.direction = "rtl";// single css
            t.innerHTML = 'group: <select id="groups"></select>'+
                          '<input type="button" value="test" '+
                          'onchange="orders.actions.test(this)">'
            document.getElementById('container').appendChild(t); // append the result to container
        },
        groups: function(options) { // kind of repaint an element
            var html = "";
            for (var option, r = 0; r < options.length; r++) {option = options[r];
                html += "<option value="+option.id+">" + option.name + "</option>";
            }
            document.getElementById('groups').innerHTML = html;
        }
    },//render
 fn:{
        decoratetext:function (sometext) {
            var t = ''
            t += 'you have selected ' + sometext
            return t;
        },

    },//fn
 actions:{
        
        test : function(thisofbtn) {
            var div = thisofbtn.parentNode;
            var select = div.getElementsByTagName("select")[0];
            var sel=select.options[select.selectedIndex];
            
            // store some data in the dom
            var prev=div.getAttribute('data-prev') || ""; 
            div.setAttribute('data-prev',sel) ; // store some data in the dom
            alert(order.fn.decoratetext(sel)+' prev: '+prev)
        }

    }
};

function orders_test()
{
 orders.render.groups_holder();
 orders.render.groups([{id:1,name:'main'},{id:2,name:'sub'}]);
 
 //load some rows on load:
 //$.ajax({"/somedata.json",dataType:'json'},function(rows){  orders.render.groups(rows); })
}
