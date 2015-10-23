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