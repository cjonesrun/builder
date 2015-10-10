function getElement(item)
{
	return document.getElementById(item);
}


function prestigeMultiplier() {
    return Math.pow(game.prestige_base, game.prestige_level);
}

function calc(level) {
	return Math.pow(game.base, level);
}

// build game.base items, add them to the total and decduct the cost from prev (if affordable)
function build(item, level, scale)
{
	// smallest item && level, free
	if (item == game.items[0]){ 
		//addMessage( [ 'building', item, 'at level', level, 'scale', scale ] );
		game.item_count[item] +=  prestigeMultiplier() * calc(level);
		updateNumber(item, game.item_count[item]);
		return;
	} 

	var prev = game.prev_map[item];
	var to_build = scale > 0 ? Math.floor( scale * game.item_count[prev] / game.base ) : 1;

	// consider using calc(level) for next_cost, so @ each level, exponentially more prevs are needed
	var next_cost = game.base * to_build; 
	
	if (to_build > 0 && game.item_count[prev] >= next_cost) {
		game.item_count[prev] -= next_cost;
		updateNumber(prev, game.item_count[prev]);
		
		game.item_count[item] +=  to_build * prestigeMultiplier() * calc(0);
		updateNumber(item, game.item_count[item]);
	} else {
		addMessage( [ 'can\'t build', item+".", 'insufficient', prev+"."] );
	}
}


function buildRateInc(item, scale) {
	var next = game.next_map[item];
	var to_build = Math.floor( scale * game.item_count[next] / game.base );
	if (to_build == 0) {
		addMessage(['can\'t build', item +" rate+.", 'insufficient', next+'.' ]);
		return;
	}

	var cost = to_build * game.base;
	game.rate_map[item] += to_build;
	game.item_count[next] -= cost;

	updateRate(item+ "_rate", game.rate_map[item]);
	updateNumber(next, game.item_count[next]);
}

// increase an item build rate buy BASE^level items per sec
function rateInc( item, rate ) {
	// biggest item, use own items
	var next;
	if (item == game.items[game.items.length-1]) {
		next = item;
	} else {
		next = game.next_map[item];
	}

	var next_cost = calc( parseInt( rate+1 ) );
	if (next_cost <= game.item_count[next]) {
		//addMessage( ['building', item, 'rate increase requires', next_cost, next ] );
		game.rate_map[item] += prestigeMultiplier() * calc( parseInt( rate ) );
		game.item_count[next] -= next_cost;
		
		updateRate(item+ "_rate", game.rate_map[item]);
		updateNumber(next, game.item_count[next]);
	} else {
		addMessage( ['can\'t build', item, 'rate+. insufficient', next+"."	, 'have', numberFormat(game.item_count[next]), 'need', numberFormat(next_cost) +"."] );
	}

	//addMessage( [item, getElement(item).value, next_map[item], getElement(next_map[item]).value]);

}

function buildAllDownTo(item) {
	//console.log('pulling all down to', item);
	for (var i=0; i < game.items.length; i++) {
		if (item == game.items[i])
			break;

		var itemCount = game.item_count[game.items[i]];
		var itemBase = game.base;

		var nextCountInc = Math.floor (itemCount / itemBase );
		var cost = nextCountInc * itemBase;
		if (nextCountInc > 0) {
			addMessage( [ 'building', nextCountInc, game.next_map[game.items[i]], 'from',  itemCount, game.items[i], 'total', cost ] );	
			game.item_count[game.items[i]] -= cost;
			game.item_count[game.next_map[game.items[i]]] += nextCountInc;
		} else
			break;
			

	}
	setData();
}

function buildAllUpTo(item) {
	//console.log('pulling all up to', item);
	for (var i=game.items.length-1; i > 0; i--) {
		if (item == game.items[i])
			break;

		var current_item = game.items[i];
		var prev = game.prev_map[current_item];
		var to_build = Math.floor( game.item_count[current_item] / game.base );
		var cost = to_build * game.base;

		if (to_build > 0) {
			addMessage( [ 'building', to_build, prev, 'rate+ from', game.item_count[current_item], current_item, 'total', cost ]);	
			game.item_count[current_item] -= cost;
			game.rate_map[prev] += to_build;

		}
	}
	setData();
}

// format the number for display
function numberFormat(number) {
	if (typeof number == 'undefined')
		return;
	else if (number === Infinity)
		return "&infin;";
	else if (number == 0 || number >=1 && number < Math.pow(game.base, game.NUMERICAL_DISPLAY_PRECISION+3) ) { // between 1 and 10^NUMERICAL_DISPLAY_PRECISION

		if (number - Math.floor(number) > 0) // a decimal number
			return number.toPrecision(game.NUMERICAL_DISPLAY_PRECISION+3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		//return number;
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		return number.toPrecision(game.NUMERICAL_DISPLAY_PRECISION);
	}
}

function updateItemInfo(item, rate) {
	getElement(item+"_display").innerHTML = item +' ['+numberFormat(rate)+'/s]';
	var next = game.next_map[item];
	getElement(item+"_display").title = '['+ game.bases[item]+' ' + item + '->' + next +' | '+numberFormat(rate)+'/s net]';
}

// updates total value in the UI
function updateTotalValue(value) {
	getElement("total_value").innerHTML = numberFormat(value);
}

function updateNumber(element_name, number) {
	getElement(element_name).value = numberFormat(number);
}

function updateRate(element_name, number) {
	getElement(element_name).value = numberFormat(number) + "/s";
}