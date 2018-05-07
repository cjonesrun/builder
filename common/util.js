// this allows loading a persisted module state back (private methods/vars/constants don't serialize) into the module
function extend(object) {
	var slice = Array.prototype.slice;
	
    slice.call(arguments, 1).forEach(copyProperties);
    return object;

    function copyProperties(source) {
        Object.getOwnPropertyNames(source).forEach(copyProperty);

        function copyProperty(name) {
            object[name] = source[name];
        }
    }
}

// calls function fcn and passes the remaining args in a params to fcn
function delegate(fcn) {
    //console.log('delegating', arguments);
    var args = [].slice.apply(arguments);
    return function() {
        //console.log('inside', args.length, args.slice(1));
        fcn.apply(this,args.slice(1));
    }
}

function hasClass(elem, cls) {
    var str = " " + elem.className + " ";
    var testCls = " " + cls + " ";
    return(str.indexOf(testCls) != -1) ;
};

function closestParentByClass(el, cls) {
    while (el  && el !== document) {
        if (hasClass(el, cls)) return el;
        el = el.parentNode;
    }
    return null;
};

function setVisible(element, visible) {
    if (element === null)
        return;
    if (visible) 
        element.removeAttribute("data-visible");
    else
        element.setAttribute("data-visible", "false");
}

function isVisible(element) {
    var vis = element.getAttribute("data-visible");
    //console.log(vis, typeof vis);

    if (vis === "false")
        return false;
    else
        return true;
}

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict['_' + phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
            dict['_' + phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}
 
// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict['_'+currCode] ? dict['_'+currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict['_'+code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

function prettyDate(date){
    return new Date().toDateString() + " " + new Date().toLocaleTimeString();
}
function timeFormat(numberInMillis) {
    var millis = numberInMillis;
    var hours = Math.floor( millis / (60*60*1000) );
    console.log(hours);
    millis -= hours * 60*60*1000;

    var mins = Math.floor( millis / (60*1000) );
    millis -= mins * 60*1000;

    var seconds = Math.floor( millis / 1000 );
    millis -= seconds * 1000;

    var str = "";
    if (hours > 0) str += hours + "h ";
    if (mins > 0) str += mins + "m "
    if (seconds > 0) str += seconds +"s ";
    
    str += millis + "ms";
    return str;
}

// format the number for display
function numberFormat(number, precision) {
    if (precision === undefined || precision === null){
        NUMERICAL_DISPLAY_PRECISION = 5;
    } else
        NUMERICAL_DISPLAY_PRECISION = precision;

    if (number === undefined || number === null)
        return;
    else if (number === Infinity)
        return "∞";
    /*else if (number === 0 || number === Math.floor(number)){
        //if (number > Math.pow(game.base, NUMERICAL_DISPLAY_PRECISION+3)) {
        //    return number.toPrecision(4);//.replace(/0+$/g, "")
        //}

        return numeral(number).format('0,0');
    } else {
        return Number(number.toPrecision(NUMERICAL_DISPLAY_PRECISION+3));
    }*/
    if (number > Math.pow(10, NUMERICAL_DISPLAY_PRECISION+3))
        return number.toExponential(NUMERICAL_DISPLAY_PRECISION);
    else
        return Number(number.toPrecision(NUMERICAL_DISPLAY_PRECISION+3));
}

// create a checkbox element
function check(id, className, value, title, attr_map){
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = value;
    return decorateElement(cb, id, className, value, title, attr_map);
}

// create a text element
function text(id, className, innerHTML, title, attr_map){
    return decorateElement(document.createElement("text"), id, className, innerHTML, title, attr_map);
}

// create div element
function div(id, className, innerHTML, title, attr_map){
    return decorateElement(document.createElement("div"), id, className, innerHTML, title, attr_map);
}
function decorateElement(element, id, className, innerHTML, title, attr_map){
     if (id !== undefined && id !== null)
        element.setAttribute("id", id);
    if (className !== undefined && className !== null)
        element.setAttribute("class", className);
    element.innerHTML = innerHTML;
    
    if (title !== undefined && title !== null )
        element.title = title;
    
    addAttributes(element, attr_map);

    return element;
}

function addAttributes(element, map) {
    // map of attribute k/v pairs
    if (map === undefined || map === null) 
        return;
    else {
        for (attr in map) {
            element.setAttribute(attr, map[attr]);
        }
    }
}

function include(file){
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}
