
// GET params parsing
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

// Key controls
function recoverCode(e){
  if(window.event) // IE like
  {
	  var e = window.event
  	var code = e.which || e.keyCode
  }
  else // rest of the world
  {
    // keyCode vs charCode vs which
	  var code = e.which
	  
	  if( code == 0 )
	  {
		  code = e.charCode || e.keyCode;
		  if(code == 0)
		  {
			  code = e.keyCode;
		  }
	  }
  }
  return code;
}

// Cross-browser implementation of element.addEventListener()
function addListener(element, type, expression, bubbling)
{
    bubbling = bubbling || false;
     
    if(window.addEventListener) { // Standard
    element.addEventListener(type, expression, bubbling);
    return true;
    } else if(window.attachEvent) { // IE
    element.attachEvent('on' + type, expression);
    return true;
    } else return false;
}

// hook_click
function hookClick(id,func)
{
	element=document.getElementById(id);
	if(element)
	{
		//element.removeEventListener("click",func);
		addListener(element, "click", func);
	}
}

function hookChange(id,func)
{
	element=document.getElementById(id);
	if(element)
	{
		//element.removeEventListener("change",func);
		addListener(element, "change", func);
	}
}

// generic hook
function hookEvent( id, func, event )
{
  element=document.getElementById(id);
	if(element)
	{
		//element.removeEventListener("change",func);
		addListener(element, event ,func);
	}
}
