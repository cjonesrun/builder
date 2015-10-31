function getElement(item){
	return document.getElementById(item);
}

function prestigeMultiplier() {
    return Math.pow(game.pmm.base, game.pmm.current_level);
}

function updateUI() {
    var prev_build_rate = 0;
    
    var rows = document.getElementsByClassName("item-data-row");
    for (var i = 0; i<rows.length; i++ ) {
    	var itemid = rows[i].getAttribute("item-id");
    	
    	var build_rate = calcBuildRate( i );    

    	var count = rows[i].querySelector("#count");
    	var build = rows[i].querySelector("#build");
    	var rate = rows[i].querySelector("#rate");

    	if (i<rows.length-1)
    		handleRow(i, rows[i], i+1, rows[i+1]);

    	count.textContent = numberFormat(game.map[i].count);
    	count.title = 'inventory ' + count.innerHTML + ' ' + game.map[itemid].name;
		rate.textContent = i > 0 ? numberFormat(game.map[i].rate) + "/s" : "";

    	if (game.pmm.activated && i == game.pmm.levels[game.pmm.current_level]){
    		//console.log('using this', game.map[game.pmm.levels[game.pmm.current_level]].count, autoBuildLevel(0));
    		//build.textContent = numberFormat( game.map[game.pmm.levels[game.pmm.current_level]].base * 
    		//	game.map[game.pmm.levels[game.pmm.current_level]].count ) + "/s";
			var pmm_item = game.map[game.pmm.levels[game.pmm.current_level]];
			//build.textContent = numberFormat(pmm_item.count * Math.pow(game.pmm.base, game.pmm.state[game.pmm.current_level]));
    	} else
    		//build.textContent = numberFormat(build_rate) + "/s";

    	updateItemInfo(rows[i], game.map[i].rate + prev_build_rate);

		prev_build_rate = build_rate;
    }

    
    if (game.pmm.state !== undefined && game.pmm.state.length > 0) {
    	for (var i=0; i<game.pmm.state.length; i++){
    		if (game.pmm.state[i] > 0){
    			enablePMM(i, game.pmm.state[i]);
    		}
    	}
    }


    //console.log( game.total_value, game.total_value_rate, game.total_value_accel);
    updateTotalValue(game.total_value, game.total_value_rate, game.total_value_accel);
    getElement("running").textContent = timeFormat( Math.floor( (new Date().getTime() - game.game_started) / 1000));
    getElement("tick_rate").textContent = numberFormat(game.tickRate()) + "/s";
}

function handleRow(i, row, i_next, next_row){
	// current row visibility
	var show = game.map[i].count >= game.map[i].base || game.map[i_next].active;

	if (show) {
		if (game.pmm.activated && i >= game.pmm.levels[game.pmm.current_level]){
			setVisible(next_row, false);
		} else if (i >= game.pmm.levels[game.pmm.current_level]) {
			setVisible(next_row, false);
		} else {
			setVisible(next_row, true);
		}
		//game.map[i_next].active = true;
	} else {
		if (!game.map[i_next].active)
			setVisible(next_row, false);
	}
	
	if (i_next < game.num_items()-1) {
		setVisible( row.querySelector("#rate_build_single"), game.map[i_next].active );
		setVisible( row.querySelector("#rate_build_half"), game.map[i_next].active );
		setVisible( row.querySelector("#rate_build_all"), game.map[i_next].active );
		setVisible( row.querySelector("#pull_up"), game.map[i_next].active );

		// not present in the first row
		setVisible( row.querySelector("#push_up"), game.map[i_next].active && i > 0 );
		setVisible( row.querySelector("#push_down"), game.map[i_next].active);
	}
}


function calculateItem(index) {

}

// calculate changes since last calculation.
function calculate() {
    var this_calculation = new Date().getTime();
    var diff = this_calculation - game.last_calculation;
    var ticks_since_last = Math.floor(diff / game.TICK_INTERVAL); // ticks since last calc
    //console.log('calculating for last', ticks_since_last, 'ticks (', game.TICK_INTERVAL/1000, " tick/s)");
    
    // for now, forget about less than 1s.
    if (ticks_since_last == 0)
        return;
    else if (ticks_since_last > 25 ) {
    	// a bit arbitrary, but if calc hasn't run in 25 ticks, assume no activity and show a message
        addMessage(['you\'ve been gone for', timeFormat(ticks_since_last)+'.', 'value has warped ahead by', numberFormat( total_value - game.total_value ) ]);
    }

    var done = false;
    for (var j = 0; j<ticks_since_last; j++) {
        for (var i=0; i < game.num_items() && !done; i++) {
        	var item = game.map[i];
            var prev = game.map[item.previous];

            var next;
            if (i > game.pmm.levels[game.pmm.current_level])
            	break;
            else if ( game.pmm.activated && i == game.pmm.levels[game.pmm.current_level]){
            	next = game.map[0];
			}
            else
            	next = game.map[item.next];


            var adjust = game.map[i].rate * (game.TICK_INTERVAL/1000);
            
            item.count += adjust;
            if (i>0) {
            	//item.count += calcBuildRate( item.previous ); // this is for "free" auto-building
            	if (item.auto_pull && prev.count >= prev.base){ // this is for auto-building that consumes previous items
	            	item.count += item.auto_pull ? 1 : 0;
	            	prev.count -= prev.base;
	            }
            } else if (game.pmm.activated) {
            	var pmm_item = game.map[game.pmm.levels[game.pmm.current_level]];
            	//console.log('perpetual motion on', item.name, "from", pmm_item.name, 'of', calcBuildRate( game.pmm.levels[game.pmm.current_level] ));
            	//game.map[0].count += calcBuildRate( game.pmm.levels[game.pmm.current_level] );
            	//game.map[0].count += Math.floor( game.map[game.pmm.levels[game.pmm.current_level]].count / autoBuildLevel(0) );

            	var mult = Math.pow(game.pmm.base, game.pmm.state[game.pmm.current_level]);
            	
            	//console.log(pmm_item.name, game.pmm.state[game.pmm.current_level], mult, pmm_item.count * mult);
            	game.map[0].count += pmm_item.count * mult; 
            }

            // activate next?
            if (game.map[i].count >= game.map[i].base && i<game.pmm.levels[game.pmm.current_level] )
            	game.map[i+1].active = true;
            
            // bail out if no active rows
			if (!item.active){
        		done = true;
       			break;
        	} else if (i < game.num_items() -1 && (item.count >= autoBuildLevel(i) && !next.active)){
        		//console.log(i, "setting", next.name, "to active.");
        		
        		if (i == game.pmm.levels[game.pmm.current_level]) {
        			//console.log(i, item.next, game.pmm.current_level, game.pmm.levels[game.pmm.current_level]);
        			game.pmm.activated = true;

        			enablePMM(game.pmm.current_level, 0); // initialize this pmm with zero
        			console.log("starting perpetual motion from", item.name, "back to", game.map[0].name+".", "took", 
        				timeFormat( Math.floor( (new Date().getTime() - game.game_started) / 1000)));
        		} else {
        			next.active = true;
        		}
        	} else {

        	}
        }        
    }

    var total_value = 0;
    for (var i = 0; i < game.num_items()-1; i++) 
    	total_value += calcTotalItemValue(i);
    
    // set game totals
    var new_rate = Math.max(0, ( total_value - game.total_value ) / (ticks_since_last));
    game.total_value_accel = Math.max(0, ( new_rate - game.total_value_rate ) );
    game.total_value_rate = new_rate;
    game.total_value = total_value;
    
    // back up the last_calc by remainder so it gets included next tick
    game.last_calculation = this_calculation - (diff - ticks_since_last * game.TICK_INTERVAL);
}

function enablePMM(index, init){

	game.pmm.state[index] = init;

	var tabBarDiv = getElement("tab_bar_div");

	var id = "tab_div_"+ index;
	var pmm = tabBarDiv.querySelector("#" + id);
	if (pmm === undefined || pmm === null){
		var newDiv = document.createElement("div");
		newDiv.id = id;
		newDiv.className = "tab_bar_div_child left";
		newDiv.setAttribute("pmm-index", index);

		if (init === 0)
			newDiv.textContent = "Click to activate PMM"+ (tabBarDiv.children.length);
		else 
			newDiv.textContent =  "PMM" + index + ": " + game.pmm.state[index];
		tabBarDiv.appendChild(newDiv);
	}
}

function calcBuildCost(item, count){
	return item.base * count;
}

function calcBuildCount(item, scale){
	//console.log(item, scale, scale > 0);
	return scale > 0 ? Math.floor( scale * item.count / item.base ) : 1;
}

function calcTotalItemValue(i){
	//console.log(game.map[i].name, i, typeof i, game.map[i].count * calcItemValue(i));
	return game.map[i].count * calcItemValue(parseInt(i));
}
function calcItemValue(i) {
	return Math.pow(game.base, game.min_exponent + parseInt(i) +1);
};


function autoBuildLevel(i) {
	var pow = 2 + i / game.base;
	var denom = Math.pow(game.map[i].base,pow);

	return denom;
}

function calcBuildRate(i) {
	// build rate is item-count / item-base^pow
	var val = Math.floor( game.map[i].count / autoBuildLevel(i) );
	//if (game.map[i].count > 0)
	//	console.log(game.map[i].name, game.map[i].count, '/', game.map[i].base,'^', (2+i/game.base), "=", val);
	
	return val;
}

// build items, add them to the total and decduct the cost from prev (if affordable)
function build(i, scale) {	
	//console.log(i,scale);
	var item = game.map[i];
	// smallest item && level, free
	if (item.previous == null){ 
		//addMessage( [ 'building 1', item.name ] );
		item.count +=  prestigeMultiplier();
	} else {
		var prev = game.map[item.previous];
		var to_build = calcBuildCount(prev, scale);
		var cost = calcBuildCost(prev, to_build); 
		
		//console.log( 'building', to_build, item.name, 'using', cost, prev.name, item.count, prev.base, prestigeMultiplier());
		if (cost > 0 && prev.count >= cost) {
			prev.count -= cost;
			item.count +=  to_build * prestigeMultiplier();
			
			addMessage( ['building', numberFormat(to_build), item.name, 'costing', numberFormat(cost), prev.name ] );
		} else {
			addMessage( [ 'can\'t build', item.name+".", 'insufficient', prev.name+".", 'have', numberFormat(prev.count), 'need',
				(cost > 0) ? numberFormat(cost) : numberFormat(Math.ceil(prev.base/scale)) ]);
		}
	}
	updateUI();
}

function buildRateInc(i, scale) {
	var item = game.map[i];
	var next = game.map[item.next];

	// at last item, let the costing for next be the cost of iteself
	if (next == null){ 
		next = item;
	} 

	var to_build = calcBuildCount(next, scale);
	var cost = calcBuildCost(next, to_build); 

	//console.log( 'building', to_build, item.name, 'using', cost, next.name, item.count, next.base, prestigeMultiplier());
	if (to_build > 0 && next.count >= cost) {
		item.rate += to_build;
		next.count -= cost;

		addMessage( ['building', numberFormat(to_build), item.name, 'rate+ costing', numberFormat(cost), next.name ] );
	} else {
		addMessage( [ 'can\'t build', item.name, "rate+. insufficient", next.name+".", 'have', numberFormat(next.count), 'need',
			(cost > 0) ? numberFormat(cost) : numberFormat(Math.ceil(next.base/scale)) ]);
	}
	updateUI();
}

function buildDown(from, to) {
	//console.log('building down from', game.map[from].name, 'to', game.map[to].name);
	for (var i=from; i < to; i++) {
		if (to == i)
			break;

		var item = game.map[i];
		var itemCount = item.count;
		var itemBase = item.base;

		var to_build = calcBuildCount(item, 1);
		var cost = calcBuildCost(item, to_build);
		if (to_build > 0) {
			addMessage( [ 'building', numberFormat(to_build), game.map[item.next].name, 'from',  numberFormat(itemCount), item.name, 'total', numberFormat(cost) ] );
			game.map[i].count -= cost;
			game.map[item.next].count += to_build
		} else if (!game.map[item.next].active) {
			// we are done if next item is active is active (since to_build is 0)
			break;
		}
	}
	updateUI();
}

function buildUp(from, to) {
	//console.log('building up from', game.map[from].name, 'to', game.map[to].name);
	for (var i=from; i > 1; i--) {
		if (to == i)
			break;

		var item = game.map[i];
		var previous = game.map[item.previous];
		var to_build = calcBuildCount(item, 1);
		var cost = to_build * item.base;

		if (to_build > 0) {
			addMessage( [ 'building', numberFormat(to_build), previous.name, 'rate+ from', numberFormat(item.count), item.name, 'total', numberFormat(cost) ]);
			item.count -= cost;
			previous.rate += to_build;

		}
	}
	updateUI();
}

// format the number for display
function numberFormat(number, precision) {
	if (number === undefined || typeof number === 'undefined')
		return;
	else if (number === Infinity)
		return "∞";
	else if (number == 0 || number == Math.floor(number)){
		if (number > Math.pow(game.base, game.NUMERICAL_DISPLAY_PRECISION+3)) {
			return number.toPrecision(4)/*.replace(/0+$/g, "")*/;
		}
		return numeral(number).format('0,0');
	}
	var ret = number.toPrecision(4);
	return ret.indexOf("e")>=0?ret:ret.replace(/0+$/g, "");
}

function timeFormat(number) {
	var seconds = number;
	var hours = Math.floor( seconds / (60*60) );
	seconds -= hours * 60*60;

	var mins = Math.floor( seconds / 60 );
	seconds -= mins * 60;

	var str = "";
	if (hours > 0) str += hours + "h ";
	if (mins > 0) str += mins + "m "
	str += seconds + "s";
    return str;
}

function updateItemInfo(row, rate) {
	var i = row.getAttribute("item-id");
	var item = game.map[i];
	if (!item.active)
		return;
	var starts_building_at = autoBuildLevel(i);
	
	var name = row.querySelector("#name");
	name.innerHTML = item.name + " ["+ numberFormat(item.base)+"]";/* +' ['+numberFormat(rate)+'/s, ' + item.base + ']';*/
	var next = game.map[item.next];


	var info_row = row.nextSibling;
	var container = info_row.getElementsByClassName("expanded-item-data-col")[0];
	while (container.firstChild) {
	    container.removeChild(container.firstChild);
	}

	var list = buildUL();

	addLI(list, numberFormat(item.base) + ' ' + item.name + '->' + ((i != game.num_items()-1) ? next.name : item.name));
    addLI(list, 'starts building ' + ((i != game.num_items()-1) ? next.name : item.name ) + ' @' + 
    		numberFormat(Math.ceil(starts_building_at)) + " " + item.name);
    addLI(list, "accruing " + numberFormat(rate)+ " " + item.name + '/s net');

    if (i != game.num_items()-1)
		addLI(list, 'building ' + numberFormat(calcBuildRate( i ))  + " " + next.name + '/s');
	addLI(list, "each " + item.name + " is worth " + numberFormat(calcItemValue(i)));
	addLI(list, "total " + item.name + " value is " + numberFormat(calcTotalItemValue(i)));
	info_row.getElementsByClassName("expanded-item-data-col")[0].appendChild(list);
	
	// update title text from the LI items
	var str = "";
	var li_items = list.querySelectorAll("li");
	for (var li = 0; li < li_items.length; li++){
		str += li_items[li].innerText + " | ";
	}
	name.title = "| " + str.trim();
}

function buildUL() {
	return document.createElement('ul');
};

function addLI(ul, str) {
	var itemX = document.createElement('li');
    itemX.appendChild(document.createTextNode(str));
    ul.appendChild(itemX);
    return itemX; // if needed
};

// updates total value in the UI
function updateTotalValue(value, rate, accel) {
	getElement("total_value").innerHTML = numberFormat(value);
	getElement("total_value_rate").innerHTML = numberFormat(rate) + '/s';
	getElement("total_value_accel").innerHTML = numberFormat(accel)  + '/s<sup>2</sup>';
}

function updateNumber(element, number) {
	//console.log('updateNumber', element_name, number, getElement(element_name));
	element.innerHTML = numberFormat(number);
}

function updateRate(element, number) {
	//console.log('updateRate', element_name, number, getElement(element_name));
	element.innerHTML = numberFormat(number) + "/s";
}

function updateExpandDataRowVisibility(row, element){
	var rowToShow = getElement(row.getAttribute("expanded-item-data-row"));
	var arr = row.parentNode.querySelectorAll(".expanded-item-data-row");
	
	for (var i = 0; i < arr.length; i++){
		// collapse everything, don't touch the 
		if (rowToShow.id !== arr[i].id) {
			setVisible(arr[i], false);
			row.parentNode.querySelector("#"+arr[i].getAttribute("main-item-row-id")).querySelector(".expander").innerHTML = "+";
		}
	}
	if (isVisible( rowToShow )){
		element.innerHTML = "+";
		setVisible(rowToShow, false);
	} else {
		element.innerHTML = "-";
		setVisible(rowToShow, true);
	}	
}

function setMessage(str_arr) {
	addMessage(str_arr, true);
}

function addMessage(str_arr, clearFirst){
	var dump = str_arr.join(" ");

	if (!clearFirst)
		dump += "\n" + document.getElementById( 'messages' ).value;

	var lines = dump.split("\n");
	if (lines.length > 20) {
		dump = '';
		for (var i =0; i<20; i++)
			dump += lines[i] +'\n'; 
	}
	document.getElementById( 'messages' ).value = dump;

	//console.log( (messagesWindow.value.match(/\n/g) || []).length);
	// TODO: trim the log to, say, 1,000 characters
}

function clearMessages() {
	setMessage( [] );
}













