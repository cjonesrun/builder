function getElement(item)
{
	return document.getElementById(item);
}


function prestigeMultiplier() {
    return Math.pow(PRESTIGE_BASE, PRESTIGE_LEVEL);
}

function calc(level) {
	return Math.pow(BASE, level);
}

// build 10^level items, add them to the total and decduct the cose from prev (if affordable)
function build(item, level)
{
	//addMessage( ['building', item, 'at level', level] );
	// lowest smallest item && level, free
	if (item == items_arr[0])	{ 
		itemInc(item, level);
		return;
	}

	var prev = prev_map[item];
	var next_cost = calc(level+1);
	if (item_count_map[prev] >= next_cost) {
		item_count_map[prev] -= next_cost;
		getElement(prev).value = numberFormat(item_count_map[prev]);
		itemInc(item, level);
	} else {
		addMessage( ['can\'t build', item+".", 'insufficient', prev_map[item]+"."	, 'have', numberFormat(item_count_map[prev]), 'need', numberFormat(next_cost)+"."] );
	}
}

// build as many items as possible at the given level
function buildAll(item) {
	// nothing to do
	if (item == items_arr[0])	{ 
		return;
	}

	var prev = prev_map[item];

	var to_build = Math.floor( item_count_map[prev] / BASE );
	if (to_build == 0) {
		addMessage(['can\'t build', item +".", 'insufficient', prev +'.' ]);
		return;
	}

	var cost = to_build * BASE;
	item_count_map[item] += to_build;
	item_count_map[prev] -= cost;

	getElement(item).value = numberFormat(item_count_map[item]);
	getElement(prev).value = numberFormat(item_count_map[prev]);
}

function buildAllRateInc(item) {
	var next = next_map[item];

	var to_build = Math.floor( item_count_map[next] / BASE );
	if (to_build == 0) {
		addMessage(['can\'t build', item +" rate+.", 'insufficient', next+'.' ]);
		return;
	}

	var cost = to_build * BASE;
	rate_map[item] += to_build;
	item_count_map[next] -= cost;

	getElement(item+ "_rate").value = numberFormat(rate_map[item]) + "/s";
	getElement(next).value = numberFormat(item_count_map[next]);
}

// increase an item count by BASE^level items
function itemInc(item, level) {
	var count = item_count_map[item];
	item_count_map[item] +=  prestigeMultiplier() * calc(level);
	getElement(item).value = numberFormat(item_count_map[item]);
}

function itemDec(item, level) {

}

// increase an item build rate buy BASE^level items per sec
function rateInc( item, rate ) {
	// biggest item, use own items
	var next;
	if (item == items_arr[items_arr.length-1]) {
		next = item;
	} else {
		next = next_map[item];
	}

	var next_cost = calc( parseInt( rate+1 ) );
	if (next_cost <= item_count_map[next]) {
		//addMessage( ['building', item, 'rate increase requires', next_cost, next ] );
		rate_map[item] += prestigeMultiplier() * calc( parseInt( rate ) );
		item_count_map[next] -= next_cost;
		
		getElement(item + "_rate").value = numberFormat(rate_map[item]) + "/s";
		getElement(next).value = numberFormat(item_count_map[next]);
	} else {
		addMessage( ['can\'t build', item, 'rate+. insufficient', next+"."	, 'have', numberFormat(item_count_map[next]), 'need', numberFormat(next_cost) +"."] );
	}

	//addMessage( [item, getElement(item).value, next_map[item], getElement(next_map[item]).value]);

}


// 
function numberFormat(val) {
	return val;
}