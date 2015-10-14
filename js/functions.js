function getElement(item)
{
	return document.getElementById(item);
}


function prestigeMultiplier() {
    return Math.pow(game.prestige_base, game.prestige_level);
}

function setData() {
    var prev_build_rate = 0;
    for (var i=0; i < game.item_names.length; i++) {

        var build_rate = calcBuildRate( i );

        updateRate("build_"+i, build_rate);
        updateRate("rate_"+i, game.map[i].rate);
        updateNumber("count_"+i, game.map[i].count);

        updateItemInfo(i, game.map[i].rate + prev_build_rate)
        
        prev_build_rate = build_rate;
    }

    updateTotalValue(game.total_value, game.total_value_rate, game.total_value_accel);
    updateNumber("running", Math.floor( (new Date().getTime() - game.game_started) / 1000));
}

// calculate changes since last calculation.
function calculate() {
    var this_calculation = new Date().getTime();
    var diff = this_calculation - game.last_calculation;
    var sec_since_last = Math.floor(diff / 1000); // time in s since last calc
    //console.log('calculating for last', sec_since_last);

    // for now, forget about less than 1s. catch is if tick is < 1s, this will only calc each sec...
    if (sec_since_last == 0)
        return;

    var total_value = 0;
    for (var j = 0; j<sec_since_last; j++) {
        for (var i=0; i < game.item_names.length; i++) {
            var item = game.map[i];
            var prev = game.map[item.previous];
            var next = game.map[item.next];
            var adjust = game.map[i].rate * (game.UI_REFRESH_INTERVAL/1000);
            
            item.count += adjust;
            if (i>0) {
                // take prev (i-1) count divided by BASE^(i+1)
                var newBuild = Math.floor( prev.count / Math.pow(prev.base,(i+1) ) );
                item.count += newBuild;
            }

            if (j == sec_since_last -1) {
                if (game.map[i].count > 0) {
                    //console.log( 'adding', game.map[i].name, game.map[i].count, calcItemValue(i));
                    total_value += calcItemValue(i);
                }
            }
        }        
    }

    if (sec_since_last > game.UI_REFRESH_INTERVAL * 25 / 1000 ) {// a bit arbitrary, but if calc hasn't run in 25 ticks, assume no activity
        var seconds = sec_since_last;
        var hours = Math.floor( seconds / (60*60) );
        seconds -= hours * 60*60;

        var mins = Math.floor( seconds / 60 );
        seconds -= mins * 60;

        var str = "";
        if (hours > 0) str += hours + "h ";
        if (mins > 0) str += mins + "m "
        str += seconds + "s"

        //console.log( sec_since_last, hours+'h', mins+'m', seconds+'s.');
        addMessage(['welcome back. you\'ve been gone for', str+'.', 'value has warped ahead by', numberFormat( total_value - game.total_value ) ]);
    }

    // set game totals
    var new_rate = Math.max(0, ( total_value - game.total_value ) / (sec_since_last));
    game.total_value_accel = Math.max(0, ( new_rate - game.total_value_rate ) );
    game.total_value_rate = new_rate;
    game.total_value = total_value;

    //console.log("value_rate", numberFormat( total_value - game.total_value ));
    
    // keep track of the remainder, if any.
    game.last_calculation = this_calculation - (diff - sec_since_last * 1000);
}

// build items, add them to the total and decduct the cost from prev (if affordable)
function build(i, scale) {	
	//console.log(i,scale);
	var item = game.map[i];
	// smallest item && level, free
	if (item.previous == null){ 
		//addMessage( [ 'building 1', item.name ] );
		item.count +=  prestigeMultiplier();
		updateNumber("count_"+i, item.count);
		return;
	} 

	var prev = game.map[item.previous];
	var to_build = scale > 0 ? Math.floor( scale * prev.count / prev.base ) : 1;

	// consider using calc(level) for next_cost, so @ each level, exponentially more prevs are needed
	var cost = prev.base * to_build; 
	
	//console.log( 'building', to_build, item.name, 'using', cost, prev.name, item.count, prev.base, prestigeMultiplier());
	if (to_build > 0 && prev.count >= cost) {
		prev.count -= cost;
		item.count +=  to_build * prestigeMultiplier();
		
		addMessage( ['building', numberFormat(to_build), item.name, 'costing', numberFormat(cost), prev.name ] );
		updateNumber("count_"+item.previous, prev.count);
		updateNumber("count_"+i, item.count);
	} else {
		addMessage( [ 'can\'t build', item.name+".", 'insufficient', prev.name+".", 'have', numberFormat(prev.count), 'need',
			(cost > 0) ? numberFormat(cost) : numberFormat(Math.ceil(prev.base/scale)) ]);
	}
}

function buildRateInc(i, scale) {
	var item = game.map[i];
	var next = game.map[item.next];

	// at last item, let the costing for next be the cost of iteself
	if (next == null){ 
		next = item;
	} 

	var to_build = scale > 0 ? Math.floor( scale * next.count / next.base ) : 1;
	var cost = to_build * next.base;
	
	//console.log( 'building', to_build, item.name, 'using', cost, next.name, item.count, next.base, prestigeMultiplier());
	if (to_build > 0 && next.count >= cost) {
		item.rate += to_build;
		next.count -= cost;

		addMessage( ['building', numberFormat(to_build), item.name, 'rate+ costing', numberFormat(cost), next.name ] );
		updateRate("rate_"+i, item.rate);
		updateNumber("count_"+item.next, next.count);
	} else {
		addMessage( [ 'can\'t build', item.name, "rate+. insufficient", next.name+".", 'have', numberFormat(next.count), 'need',
			(cost > 0) ? numberFormat(cost) : numberFormat(Math.ceil(next.base/scale)) ]);
	}
}

function buildAllDownTo(index) {
	//console.log('pulling all down to', game.map[index].name);
	for (var i=0; i < game.item_names.length; i++) {
		if (index == i)
			break;

		var item = game.map[i];
		var itemCount = item.count;
		var itemBase = item.base;

		var nextCountInc = Math.floor (itemCount / itemBase );
		var cost = nextCountInc * itemBase;
		if (nextCountInc > 0) {
			addMessage( [ 'building', numberFormat(nextCountInc), game.map[item.next].name, 'from',  numberFormat(itemCount), item.name, 'total', numberFormat(cost) ] );
			game.map[i].count -= cost;
			game.map[item.next].count += nextCountInc
		} else
			break;
	}
	setData();
}

function buildAllUpTo(index) {
	//console.log('pulling all up to', game.map[index].name);
	for (var i=game.item_names.length-1; i > 0; i--) {
		if (index == i)
			break;

		var item = game.map[i];
		var previous = game.map[item.previous];
		var to_build = Math.floor( item.count / item.base );
		var cost = to_build * item.base;

		if (to_build > 0) {
			addMessage( [ 'building', numberFormat(to_build), previous.name, 'rate+ from', numberFormat(item.count), item.name, 'total', numberFormat(cost) ]);
			item.count -= cost;
			previous.rate += to_build;

		}
	}
	setData();
}

function calcItemValue(i) {
	//console.log(game.map[i].name, game.map[i].count, '*', game.base,'^',min_exponent + i +1);
	return game.map[i].count * Math.pow(game.base, game.min_exponent + i +1);
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

// format the number for display
function numberFormat(number, precision) {
	if (typeof number == 'undefined')
		return;
	else if (number === Infinity)
		return "&infin;";
	else if (number == 0 || number >=1 && number < Math.pow(game.base, game.NUMERICAL_DISPLAY_PRECISION+3) ) { // between 1 and 10^NUMERICAL_DISPLAY_PRECISION

		if (number - Math.floor(number) > 0) { // a decimal number
			return number.toPrecision(game.NUMERICAL_DISPLAY_PRECISION+3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		//return number;
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		if (typeof precision !== 'undefined') {
			return number.toPrecision(precision);
		} else
			return number.toPrecision(4);
	}
}

function updateItemInfo(i, rate) {
	var item = game.map[i];
	var starts_building_at = autoBuildLevel(i);
	
	getElement("name_" + i).innerHTML = item.name +' ['+numberFormat(rate)+'/s, ' + item.base + ']';
	var next = game.map[item.next];
	if (i == game.item_names.length-1)
		next = item;
	getElement("name_" + i).title = '['+ item.base + ' ' + item.name + '->' + next.name +' | '+ 
		'@' + numberFormat(Math.ceil(starts_building_at)) + " | " +

	numberFormat(rate)+'/s net]';
	
}

// updates total value in the UI
function updateTotalValue(value, rate, accel) {
	getElement("total_value").innerHTML = numberFormat(value);
	getElement("total_value_rate").innerHTML = numberFormat(rate) + '/s';
	getElement("total_value_accel").innerHTML = numberFormat(accel)  + '/s<sup>2</sup>';
}

function updateNumber(element_name, number) {
	//console.log('updateNumber', element_name, number, getElement(element_name));
	getElement(element_name).innerHTML = numberFormat(number);
}

function updateRate(element_name, number) {
	//console.log('updateRate', element_name, number, getElement(element_name));
	getElement(element_name).innerHTML = numberFormat(number) + "/s";
}