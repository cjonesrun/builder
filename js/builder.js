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
    t1.setAttribute("id", id);
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
        row.id = "item_row_"+i;
        main_table.appendChild(row);
        
        row.setAttribute("item-id", i);
        row.setAttribute("class", "item-data-row");

        // hidden by default, set to false. always show first item
        if (i == 0) row.setAttribute("data-visible", "true");
        
        addToCell(row.cells[0], text("index", i), 'item-index-display');
        addToCell(row.cells[1], text("name", game.item_names[i]), 'item-name-display');

        addToCell(row.cells[2], text("count", 0), 'numeric-display');
        addToCell(row.cells[3], text("rate", "0/s"), 'numeric-display');
        addToCell(row.cells[4], text("build", "0/s"), 'numeric-display');

        addToCell(row.cells[5], button("build_1", '1', 'build ' + numberFormat(prestigeMultiplier()) + ' ' + game.map[i].name));
       
        if (i>0) { // skip cells 6,7,8 for i=0
            addToCell(row.cells[6], button("build_half", '1/2', 'build 1/2 the max number of ' + game.map[i].name));
            addToCell(row.cells[7], button("build_all", 'max', "build max number of " + game.map[i].name));
            addToCell(row.cells[8], button("pull_down", '&#8626;', "pull all builds down to "+ game.map[i].name));
        }
        addToCell(row.cells[8], button("push_down", '&#8615;', "push all builds down from "+ game.map[i].name));
       
        if (i < game.item_names.length-1) { // skip 9 thru 12 for last row
            addToCell(row.cells[9], button("rate_build_1", '1', "rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s"));
            addToCell(row.cells[10], button("rate_build_half", '1/2', "rate+ " + game.map[i].name + " by using 1/2 available " + game.map[game.map[i].next].name));
            addToCell(row.cells[11], button("rate_build_all", 'max', "rate+ " + game.map[i].name + " by using max available " + game.map[i].next));
            addToCell(row.cells[12], button("pull_up", '&#8624;', "pull all rate+ up to "+ game.map[i].name));
            addToCell(row.cells[12], button("push_up", '&#8613;', "push all rate+ up from "+ game.map[i].name));
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

populateTable();
//assignFunctions();