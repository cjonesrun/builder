function boldStr(str) {
    var t1 = document.createElement("B");
    t1.innerHTML = str;
    return t1;
}

function text(id, str, title){
    var t1 = document.createElement("text");
    t1.setAttribute("id", id);
    t1.innerHTML = str;
    
    if (typeof title === 'undefined')
        t1.title = id;
    else t1.title = title;


    return t1;
}

function button(id, str, title, onclick) {
    var t1 = document.createElement("button");
    t1.setAttribute("class", id);
    t1.innerHTML = str;
    if (typeof title === 'undefined')
        t1.title = id;
    else t1.title = title;

    if (typeof onclick !== 'undefined') {
        t1.setAttribute("onclick", onclick);
    }

    return t1;
}

function addToCell(cell, element, classAttr) {
    if (typeof classAttr !== 'undefined')
        cell.setAttribute("class", classAttr)

    cell.appendChild( element );
    return cell;
}

function buildRow() {

}

function populateTable()
{
    var main_table = document.getElementById('main_table');
    
    // item rows
    for (var i=0; i < game.item_names.length; i++) {
        var row = document.getElementById("row-to-clone").cloneNode(true); // true = deep clone of entire row
        row.removeAttribute("row-to-clone");
        main_table.appendChild(row); // hidden by default
        
        row.setAttribute("item-id", i);
        row.setAttribute("class", "item-data-row");

        // hidden by default, set to false
        row.setAttribute("data-visible", "true");
        
        row.cells[0].appendChild( text("index", i) );
        row.cells[1].appendChild( text("name", game.item_names[i]));

        addToCell(row.cells[2], text("count", 0), 'numeric-display');
        addToCell(row.cells[3], text("rate", "0/s"), 'numeric-display');
        addToCell(row.cells[4], text("build", "0/s"), 'numeric-display');

        addToCell(row.cells[5], button("build_1", '1', 'build ' + numberFormat(prestigeMultiplier()) + ' ' + game.map[i].name));
       
        if (i>0) { // skip cells 6,7,8 for i=0
            addToCell(row.cells[6], button("build_half", '1/2', 'build 1/2 the max number of ' + game.map[i].name));
            addToCell(row.cells[7], button("build_all", 'max', "build max number of " + game.map[i].name));
            addToCell(row.cells[8], button("pull_down", 'V', "pull all builds down to "+ game.map[i].name));
        }

        if (i < game.item_names.length-1) { // skip 9 thru 12 for last row
            addToCell(row.cells[9], button("rate_build_1", '1', "rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s"));
            addToCell(row.cells[10], button("rate_build_half", '1/2', "rate+ " + game.map[i].name + " by using 1/2 available " + game.map[game.map[i].next].name));
            addToCell(row.cells[11], button("rate_build_all", 'max', "rate+ " + game.map[i].name + " by using max available " + game.map[i].next));
            addToCell(row.cells[12], button("pull_up", '^', "pull all rate+ up to "+ game.map[i].name));
        }
    }
    return main_table;
}

function delegate(fcn) {
    //console.log('delegating', arguments);
    var args = [].slice.apply(arguments);
    return function() {
        //console.log('inside', args.length, args.slice(1));
        fcn.apply(this,args.slice(1));
    }
}

function setVisible(element, visible) {
    if (visible) 
        element.removeAttribute("data-visible");
    else
        element.setAttribute("data-visible", "false");
}

function isVisible(element) {
    var vis = element.getAttribute("data-visible");
    if (vis !== 'undefined')
        return true;
    else
        return (vis !== 'false');
}

populateTable();
//assignFunctions();