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
/*function build(item, level)
{
	//addMessage( ['building', item, 'at level', level] );
	// lowest smallest item && level, free
	if (item == game.items[0]){ 
		itemInc(item, level);
		return;
	}

	var prev = game.prev_map[item];
	var next_cost = calc(level+1);
	if (game.item_count[prev] >= next_cost) {
		game.item_count[prev] -= next_cost;
		updateNumber(prev, game.item_count[prev]);
		itemInc(item, level);
	} else {
		addMessage( ['can\'t build', item+".", 'insufficient', game.prev_map[item]+"."	, 'have', numberFormat(game.item_count[prev]), 'need', numberFormat(next_cost)+"."] );
	}
}*/

// build as many items as possible at the given level
function build(item, scale) {
	// nothing to do
	if (item == game.items[0]) { 
		return;
	}
	
	var prev = game.prev_map[item];

	var to_build = Math.floor( scale * game.item_count[prev] / game.base );
	if (to_build == 0) {
		addMessage(['can\'t build', item +".", 'insufficient', prev +'.' ]);
		return;
	}

	var cost = to_build * game.base;
	game.item_count[item] += to_build;
	game.item_count[prev] -= cost;

	updateNumber(item, game.item_count[item]);
	updateNumber(prev, game.item_count[prev]);
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

// increase an item count by BASE^level items
function itemInc(item, level) {
	var count = game.item_count[item];
	game.item_count[item] +=  prestigeMultiplier() * calc(level);
	updateNumber(item, game.item_count[item]);
}

function itemDec(item, level) {

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


// format the number for display
function numberFormat(number) {
	if (typeof number == 'undefined')
		return;
	else if (number === Infinity)
		return "&infin;";
	else if (number == 0 || number >=1 && number < Math.pow(game.base, game.NUMERICAL_DISPLAY_PRECISION+3) ) { // between 1 and 10^NUMERICAL_DISPLAY_PRECISION

		if (number - Math.floor(number) > 0) // a decimal number
			return number.toPrecision(game.NUMERICAL_DISPLAY_PRECISION+3);

		return number;
	} else {
		return number.toPrecision(game.NUMERICAL_DISPLAY_PRECISION);
	}
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