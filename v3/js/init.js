// instantiate the game
var game = new BuilderModule();
var pmm = new PerpetualMotionModule();

function builderInit() {
    stopTimers();
    
    updateUI();

    startTimers();
}

function addToCell(cell, element, classAttr) {
    if (typeof classAttr !== 'undefined')
        cell.setAttribute("class", classAttr)

    cell.appendChild( element );
    return cell;
}

function buildUI(){
	var main_table = document.getElementById('main_table');
	

	for (var i=0; i<game.num_items(); i++){
		var row = document.getElementById("main-item-row-to-clone").cloneNode(true); // true = deep clone of entire row
		row.id = "item_row_"+i;
        main_table.appendChild(row);

        row.setAttribute("item-id", i);
        row.setAttribute("class", "item-data-row");

        /*var additionalInfoRow = document.getElementById("expanded-item-row-to-clone").cloneNode(true); // true = deep clone of entire row
        additionalInfoRow.id = "expanded_item_row_"+i;
        main_table.appendChild(additionalInfoRow);

        additionalInfoRow.setAttribute("main-item-row-id", row.id);
        additionalInfoRow.setAttribute("class", "expanded-item-data-row");
        
        // set main row to point to the expanded row
        row.setAttribute("expanded-item-data-row", additionalInfoRow.id);*/
        row.setAttribute("data-visible", "true");
        var col_index = 0;

        //(id, className, innerHTML, title, attr_map)
        /*var txt = div("expand"+i, "expand-button-display builder_div", "+", 'expand ' + game.map[i].name, {"expand-action":"expand-data-row"});
        addToCell(row.cells[col_index++], txt);*/
        col_index++;

        addToCell(row.cells[col_index++], text("index"+i, null, i, null, { "expand-action": "expand-data-row" }),"item-index-display");
        addToCell(row.cells[col_index++], text("name"+i, null, game.map[i].name+" ["+game.map[i].base +"]", null, { "expand-action": "expand-data-row" }), "item-name-display");

        var count_div = div("count"+i, "count", "0", "", {});
        var rate_div = div("auto"+i, "auto", "0", "", {});
        //var build_div = div("build_"+i, "build", "0", "", {});

        var rate_cb = check("auto"+i, "auto", "0", "", {});

        addToCell(row.cells[col_index++], count_div, 'numeric-display');
        addToCell(row.cells[col_index++], rate_cb);
        //addToCell(row.cells[col_index++], build_div, 'numeric-display');
        col_index++;
        /*addToCell(row.cells[col_index++], 
        	div("build_single_"+i, "build_single builder_div", '1', 'auto ' + numberFormat(1) + ' ' + game.map[i].name, {}), "builder_cel");*/
        /*addToCell(row.cells[col_index++], 
        	div("auto_single_"+i, "auto_single builder_div", '1+', 'auto' + numberFormat(1) + ' ' + game.map[i].name, {}), "builder_cel");*/
/*        
        addToCell(row.cells[col_index++], div("build_half", 'build 1/2 the max number of ' + game.map[i].name, "", "build_half builder_div", '1/2'), "builder_cel");
        addToCell(row.cells[col_index++], div("build_all", "build max number of " + game.map[i].name, "", "build_all builder_div", 'max'), "builder_cel");
        addToCell(row.cells[col_index++], div("pull_down", 'pull all builds down to  ' + game.map[i].name, "", "pull_down builder_div", '&#8626;'), "builder_cel");
        
        addToCell(row.cells[col_index++], div("push_down", "push all builds down from "+ game.map[i].name, "", "push_down builder_div", '&#8615;'), "builder_cel");
       
        addToCell(row.cells[col_index++], div("rate_build_single", "rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s","", "rate_build_single builder_div", '1'), "builder_cel");
        addToCell(row.cells[col_index++], div("rate_build_half", "rate+ " + game.map[i].name + " by using 1/2 available " + game.map[game.map[i].next].name, "", "rate_build_half builder_div", '1/2'), "builder_cel");
        addToCell(row.cells[col_index++], div("rate_build_all", "rate+ " + game.map[i].name + " by using max available " + game.map[i].next, "","rate_build_all builder_div",'max'), "builder_cel");
        addToCell(row.cells[col_index++], div("pull_up", "pull all rate+ up to "+ game.map[i].name, "", "pull_up builder_div", '&#8624;'), "builder_cel");
        addToCell(row.cells[col_index++], div("push_up", "push all rate+ up from "+ game.map[i].name, "", "push_up builder_div", '&#8613;'), "builder_cel");*/
	}
}

function buildTabBar(){
	
	var tabBarDiv = document.getElementById("tab_bar_div");
	tabBarDiv.setAttribute("data-visible", "true");

	for (var i = 0; i<game.pmm.levels.length; i++){
		console.log(game.pmm.levels[i]);

		var id = "tab_div_"+ i;
		
		var newDiv = document.createElement("div");
		newDiv.id = id;
		newDiv.className = "tab_bar_div_child left";
		newDiv.setAttribute("pmm-index", i);
		newDiv.setAttribute("data-visible", "true");
		newDiv.innerHTML =  "PMM" + i + ": " + game.pmm.state[i];
		
		tabBarDiv.appendChild(newDiv);

	}
}

// init from localstorage if present, before building ui & starting the timer
var gstate = getFromLocalStorage(game.NAME);
game = extend(new BuilderModule(), gstate===null?new BuilderModule():gstate);

var pstate = getFromLocalStorage(pmm.NAME);
pmm = extend(new PerpetualMotionModule(), pstate===null?new PerpetualMotionModule():pstate);

//buildTabBar();
buildUI();

builderInit();