function text(id, str, title, attr_arr){
    var t1 = document.createElement("text");
    t1.setAttribute("id", id);
    t1.innerHTML = str;
    
    if (title === undefined)
        t1.title = id;
    else t1.title = title;

    if (attr_arr !== undefined) {
        for (attr in attr_arr) {
            t1.setAttribute(attr, attr_arr[attr]);
        }
    }

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
        var row = document.getElementById("main-item-row-to-clone").cloneNode(true); // true = deep clone of entire row
        row.id = "item_row_"+i;
        main_table.appendChild(row);

        row.setAttribute("item-id", i);
        row.setAttribute("class", "item-data-row");
        
        var additionalInfoRow = document.getElementById("expanded-item-row-to-clone").cloneNode(true); // true = deep clone of entire row
        additionalInfoRow.id = "expanded_item_row_"+i;
        main_table.appendChild(additionalInfoRow);

        additionalInfoRow.setAttribute("main-item-row-id", row.id);
        additionalInfoRow.setAttribute("class", "expanded-item-data-row");
        
        // set main row to point to the expanded row
        row.setAttribute("expanded-item-data-row", additionalInfoRow.id);

        // rows hidden by default, show first row expanded
        if (i == 0) {
            [row/*, additionalInfoRow*/].forEach(function(entry) {
                entry.setAttribute("data-visible", "true");
            });
        }

        var col_index = 0;

        var txt = text("expand"+i, '+', 'expand ' + game.map[i].name, { "expand-action": "expand-data-row", "class": "expander"});
        addToCell(row.cells[col_index++], txt);
        addToCell(row.cells[col_index++], text("index", i,  undefined, { "expand-action": "expand-data-row" }), 'item-index-display');
        
        addToCell(row.cells[col_index++], text("name", game.item_names[i], undefined, { "expand-action": "expand-data-row" }), 'item-name-display');

        //var c = text("count", 0, undefined, { "expand-action": "expand-data-row", "bind": "innerText:count" });
        var c = document.createElement("div");
        c.setAttribute("id", "count_"+i);
        c.setAttribute("title", "count");
        //c.setAttribute("bind",'textContent:count');
        c.textContent = 0;
        addToCell(row.cells[col_index++], c, 'numeric-display');
        //bind(c, game.map[i]);


        addToCell(row.cells[col_index++], text("rate", "0/s", undefined, { "expand-action": "expand-data-row" }), 'numeric-display');
        addToCell(row.cells[col_index++], text("build", "0/s", undefined, { "expand-action": "expand-data-row" }), 'numeric-display');

        addToCell(row.cells[col_index++], button("build_1", '1', 'build ' + numberFormat(prestigeMultiplier()) + ' ' + game.map[i].name));
       
        if (i>0) { // skip cells 6,7,8 for i=0
            addToCell(row.cells[col_index++], button("build_half", '1/2', 'build 1/2 the max number of ' + game.map[i].name));
            addToCell(row.cells[col_index++], button("build_all", 'max', "build max number of " + game.map[i].name));
            addToCell(row.cells[col_index++], button("pull_down", '&#8626;', "pull all builds down to "+ game.map[i].name));
        } else
            col_index += 3;
        addToCell(row.cells[col_index++], button("push_down", '&#8615;', "push all builds down from "+ game.map[i].name));
       
        if (i < game.item_names.length-1) { // skip 9 thru 12 for last row
            addToCell(row.cells[col_index++], button("rate_build_1", '1', "rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s"));
            addToCell(row.cells[col_index++], button("rate_build_half", '1/2', "rate+ " + game.map[i].name + " by using 1/2 available " + game.map[game.map[i].next].name));
            addToCell(row.cells[col_index++], button("rate_build_all", 'max', "rate+ " + game.map[i].name + " by using max available " + game.map[i].next));
            addToCell(row.cells[col_index++], button("pull_up", '&#8624;', "pull all rate+ up to "+ game.map[i].name));
            addToCell(row.cells[col_index++], button("push_up", '&#8613;', "push all rate+ up from "+ game.map[i].name));
        }

        
    }
    return main_table;
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