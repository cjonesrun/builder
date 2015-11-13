function updateUI() {
	var rows = document.getElementsByClassName("item-data-row");
	for (var i = 0; i<rows.length; i++ ) {
		var itemid = rows[i].getAttribute("item-id");
		var item = game.map[itemid];
		
		var count = rows[i].querySelector(".count");
		count.innerHTML = numberFormat(item.count);
    	count.title = 'click to build ' + item.name;

    	if (item.next != null){
	    	var auto = rows[i].querySelector(".auto");
			//auto.innerHTML = numberFormat(game.map[itemid].rate);
	    	auto.title = 'enable auto building of ' + game.map[item.next].name;
	    	auto.checked = game.map[i].rate > 0;
	    }
	}
}

function calculate() {
	var this_calculation = new Date().getTime();
    var diff = this_calculation - game.last_calculation;
    var ticks_since_last = Math.floor(diff / game.TICK_INTERVAL); // ticks since last calc
    //console.log('calculating for last', ticks_since_last, 'ticks (', game.TICK_INTERVAL/1000, " tick/s)");

    if (ticks_since_last == 0)
        return;
    else if (ticks_since_last > 25 ) {
    	// a bit arbitrary, but if calc hasn't run in 25 ticks, assume no activity and show a message
        //addMessage('you\'ve been gone for', timeFormat(ticks_since_last)+'.', 'value has warped ahead by', numberFormat( total_value - game.total_value ) );
    }

	var done = false;
    for (var j = 0; j<ticks_since_last; j++) {
        for (var i=0; i < game.num_items() && !done; i++) {
        	var item = game.map[i];

        	// activate next item if 
        	if (item.count >= item.base && item.next !== null){
            	game.map[item.next].active = true;
            	
            	if (item.rate > 0 /*&& item.stats.manual_build > 0*/){
	            	var next = game.map[item.next];

	            	// slow decay down with this
	            	//var add = Math.floor( Math.max(1, item.count/item.base) );
	            	//item.halflife = item.halflife*add;
	            	/*var hl = item.halflife - item.stats.manual_build;*/
	            	// speed up the decay as a function of manual_build clicks
	            	/*if (i<2) 
	            		console.log(item.name, item.count, item.base,item.halflife,
	            			item.stats.manual_build, "halflife",(hl),"seconds");*/
					var hl =  Math.pow(0.5, 1 / (item.halflife));
	            	item.count = item.count * hl;

	            	//next.count += 1;
	            	if (next.count === 0) 
	            		next.count = 1; // first one is free
	            	next.count *= 1+(1-hl);

	            	//console.log( Math.pow(0.5, 1 / (hl)), next.count===0?1:next.count, 1+(1-Math.pow(0.5, 1 / (hl))));
	            	//next.count /= (next.count===0?1:next.count) * (Math.pow(0.5, 1 / (hl)));

	            	//item.count /= item.decay ; //+ (/*item.base + */item.stats.manual_build)/1000;
	            	//item.decay *= item.decay > 1.5 ? 1.0 : 1.0001;

	            	//item.count /= item.decay ; //+ (/*item.base + */item.stats.manual_build)/1000;
	            	//item.decay *= item.decay > 1.5 ? 1.0 : 1.0001;

            	}
            }


       		if (!item.active){
       			done=true;
       			break;
       		}


       		//item.stats.auto_build += (item.count* item.rate - item.count);
    		/*item.count *= item.rate;
    		item.value *= item.rate;

    		if (item.previous != null)
    			game.map[item.previous].count /= item.rate;*/
    		//console.log(item.name, item.value);
    		//console.log(item.name, item.count, item.rate, item.multiplier);
       		

    	}
    }

    // back up the last_calc by remainder so it gets included next tick
    game.last_calculation = this_calculation - (diff - ticks_since_last * game.TICK_INTERVAL);
}

function toggle(item, enabled){
	var item = game.map[item];
	if (item.next === null) // last item, nothing to do
		return;
	item.rate = enabled ? 1 : 0;
}

function build(itemid, howmany){
	var item = game.map[itemid];
	
	if (item.previous === null){
		item.count += howmany;
		item.stats.manual_build += 1;
	} else if ( game.map[ item.previous ].count > howmany * game.map[ item.previous ].base ){
		game.map[ item.previous ].count -= howmany * game.map[ item.previous ].base;
		item.count += howmany;
		item.stats.manual_build += 1;
	}

	if (!item.active){
		item.active = item.count > 0;
	}


	updateUI();
}


function auto(item, howmany){
	var item = game.map[item];
	if (item.next === null) { // last item, nothing to do
		addMessage('');
		return;
	}

	var next = game.map[item.next];
	if (item.count >= howmany * item.base) {
		item.count -= howmany * item.base;
		item.rate += howmany;
	} else {
		addMessage('can\'t build', item.name, 'auto. have', item.count, item.name, 'need', howmany * item.base);
	}

	
	updateUI();
}

function hardReset() {
	clearState(game.NAME, pmm.NAME);
}

function reset() {
    // stop timers.
    //stopTimers();

    game = new BuilderModule();
    pmm = new PerpetualMotionModule();
    
    saveState();

    builderInit();
    setMessage( ['game reset.'] );
}

function saveState(){
	game.last_save = new Date().getTime();
	saveObj(game.NAME, game);
	saveObj(pmm.NAME, pmm);
}

function showGameStats(){
	clearMessages();

	var finalDump = "";
	for (var i=0; i<game.num_items(); i++){
		if (!game.map[i].active)
			continue;
		//console.log(game.map[i].stats)
		var stats = game.map[i].stats;
		finalDump += game.map[i].name + " " + JSON.stringify(stats, null, "\t")+"\n";
	}
	// bypass the MESSAGE_WINDOW_LINES limit for this
	setMessage(finalDump);
}
