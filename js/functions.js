function getElement(item)
{
	return document.getElementById(item);
}


function prestigeMultiplier() {
    return Math.pow(game.prestige_base, game.prestige_level);
}

function calc(item) {
	return Math.pow(game.map[item].base, item);
}

// build items, add them to the total and decduct the cost from prev (if affordable)
function build(i, scale)
{
	var item = game.map[i];
	// smallest item && level, free
	if (item.previous == null){ 
		//addMessage( [ 'building', item, 'at level', level, 'scale', scale ] );
		item.count +=  prestigeMultiplier();
		updateNumber(i+"_count", item.count);
		return;
	} 

	var prev = game.map[item.previous];
	var to_build = scale > 0 ? Math.floor( scale * prev.count / prev.base ) : 1;

	// consider using calc(level) for next_cost, so @ each level, exponentially more prevs are needed
	var cost = prev.base * to_build; 
	
	//console.log( 'building', to_build, item.name, 'using', cost, prev.name, item.count, prev.base, prestigeMultiplier());
	if (to_build > 0 && prev.count >= cost) {
		prev.count -= cost;
		updateNumber(item.previous+"_count", prev.count);
		
		item.count +=  to_build * prestigeMultiplier();
		updateNumber(i+"_count", item.count);
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

		addMessage( ['building', to_build, item.name, 'rate+ costing', numberFormat(cost), next.name ] );
		updateRate(i+ "_rate", item.rate);
		updateNumber(item.next+"_count", next.count);
	} else {
		addMessage( [ 'can\'t build', item.name+".", 'insufficient', next.name+".", 'have', numberFormat(next.count), 'need',
			(cost > 0) ? numberFormat(cost) : numberFormat(Math.ceil(next.base/scale)) ]);
	}
}

function buildAllDownTo(index) {
	//console.log('pulling all down to', item);
	for (var i=0; i < game.item_names.length; i++) {
		if (index == i)
			break;

		var item = game.map[i];
		var itemCount = item.count;
		var itemBase = item.base;

		var nextCountInc = Math.floor (itemCount / itemBase );
		var cost = nextCountInc * itemBase;
		if (nextCountInc > 0) {
			addMessage( [ 'building', nextCountInc, game.map[item.next].name, 'from',  numberFormat(itemCount), item.name, 'total', numberFormat(cost) ] );
			game.map[i].count -= cost;
			game.map[item.next].count += nextCountInc
		} else
			break;
			

	}
	setData();
}

function buildAllUpTo(index) {
	//console.log('pulling all up to', item);
	for (var i=game.item_names.length-1; i > 0; i--) {
		if (index == i)
			break;

		var item = game.map[i];
		var previous = game.map[item.previous];
		var to_build = Math.floor( item.count / item.base );
		var cost = to_build * item.base;

		if (to_build > 0) {
			addMessage( [ 'building', to_build, previous.name, 'rate+ from', item.count, item.name, 'total', cost ]);
			item.count -= cost;
			previous.rate += to_build;

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
		return number.toPrecision(2);
	}
}

function updateItemInfo(i, rate) {
	var item = game.map[i];
	
	getElement(i+"_display").innerHTML = item.name +' ['+numberFormat(rate)+'/s, ' + item.base + ']';
	if (i < game.item_names.length-1)
		getElement(i+"_display").title = '['+ item.base + ' ' + item.name + '->' + game.map[item.next].name +' | '+numberFormat(rate)+'/s net]';
	else
		getElement(i+"_display").title = '['+ item.base + ' | '+numberFormat(rate)+'/s net]';
}

// updates total value in the UI
function updateTotalValue(value) {
	getElement("total_value").innerHTML = numberFormat(value);
}

function updateNumber(element_name, number) {
	//console.log('updateNumber', element_name, number);
	getElement(element_name).value = numberFormat(number);
}

function updateRate(element_name, number) {
	//console.log('updateRate', element_name, number);
	getElement(element_name).value = numberFormat(number) + "/s";
}