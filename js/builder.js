function text(id, str, title, attr_arr){
    var t1 = document.createElement("text");
    t1.setAttribute("id", id);
    t1.setAttribute("class", id);
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

function div(id, title, bind, classAttr, str) {
    var c = document.createElement("div");
    c.setAttribute("id", id);
    c.setAttribute("title", title);
    c.setAttribute("bind", bind);
    c.setAttribute("class", classAttr);
    c.innerHTML = str;
    return c;
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
    for (var i=0; i < game.num_items(); i++) {
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

        /*div("count_"+i, "count", "textContent:count", "bound-element", 0), 'numeric-display')*/
        var txt = text("expand"+i, '+', 'expand ' + game.map[i].name, { "expand-action": "expand-data-row", "class": "expander"});
        addToCell(row.cells[col_index++], txt);
        addToCell(row.cells[col_index++], text("index", i,  undefined, { "expand-action": "expand-data-row" }), 'item-index-display');
        
        addToCell(row.cells[col_index++], text("name", game.map[i].name, undefined, { "expand-action": "expand-data-row" }), 'item-name-display');

        //var c = text("count", 0, undefined, { "expand-action": "expand-data-row", "bind": "innerText:count" });
        var count_div = div("count", "count", "textContent:count", "bound-element", 0);
        var rate_div = div("rate", "rate", "textContent:rate", "bound-element", i==0?"":0);
        var build_div = div("build", "build", "textContent:count", "bound-element", 0);

        addToCell(row.cells[col_index++], count_div, 'numeric-display');
        addToCell(row.cells[col_index++], rate_div);
        addToCell(row.cells[col_index++], build_div, 'numeric-display');

        // assign observer to the game item
        //Object.observe(game.map[i], numberFormattedContent(count_div, build_div, rate_div, i));
    
        addToCell(row.cells[col_index++], div("build_single", 'build ' + numberFormat(prestigeMultiplier()) + ' ' + game.map[i].name, "", 
            "build_single builder_div", '1'), "builder_cel");

        if (i>0) { // skip next 3 cells for i=0
            addToCell(row.cells[col_index++], div("build_half", 'build 1/2 the max number of ' + game.map[i].name, "", "build_half builder_div", '1/2'), "builder_cel");
            addToCell(row.cells[col_index++], div("build_all", "build max number of " + game.map[i].name, "", "build_all builder_div", 'max'), "builder_cel");
            addToCell(row.cells[col_index++], div("pull_down", 'pull all builds down to  ' + game.map[i].name, "", "pull_down builder_div", '&#8626;'), "builder_cel");
        } else {
            row.cells[col_index++].className = "builder_cel";
            row.cells[col_index++].className = "builder_cel";
            row.cells[col_index++].className = "builder_cel";
        }
        addToCell(row.cells[col_index++], div("push_down", "push all builds down from "+ game.map[i].name, "", "push_down builder_div", '&#8615;'), "builder_cel");
       
        if (i < game.num_items()-1) { // skip next 4 cells for last row
            if (i>0){
                addToCell(row.cells[col_index++], div("rate_build_single", "rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s","", "rate_build_single builder_div", '1'), "builder_cel");
                addToCell(row.cells[col_index++], div("rate_build_half", "rate+ " + game.map[i].name + " by using 1/2 available " + game.map[game.map[i].next].name, "", "rate_build_half builder_div", '1/2'), "builder_cel");
                addToCell(row.cells[col_index++], div("rate_build_all", "rate+ " + game.map[i].name + " by using max available " + game.map[i].next, "","rate_build_all builder_div",'max'), "builder_cel");
                addToCell(row.cells[col_index++], div("pull_up", "pull all rate+ up to "+ game.map[i].name, "", "pull_up builder_div", '&#8624;'), "builder_cel");
            } else {
                row.cells[col_index++].className = "builder_cel";
                row.cells[col_index++].className = "builder_cel";
                row.cells[col_index++].className = "builder_cel";
                row.cells[col_index++].className = "builder_cel";
            }

            if (i>1)
                addToCell(row.cells[col_index++], div("push_up", "push all rate+ up from "+ game.map[i].name, "", "push_up builder_div", '&#8613;'), "builder_cel");
            else 
                row.cells[col_index++].className = "builder_cel";
        }
    }
    return main_table;
}

// returns function used by observer on change event
function numberFormattedContent(count, build, rate, index) {
    return function(changes) {
        var last_change = changes[changes.length-1];
        
        count.textContent = numberFormat( game.map[index].count );
        rate.textContent = numberFormat( game.map[index].rate )+"/s";
        build.textContent = numberFormat( calcBuildRate( index ) )+"/s";
    };
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

// init from localstorage if they are present, bfore starting the timer
loadGameState();

populateTable();

builderInit();
