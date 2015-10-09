
var this_session_start_time = new Date().getTime();

var global_timer; // main timer for auto block & thing building
var state_save_timer;

function startUIUpdater() {
    global_timer = setInterval(function(){ 
        calculate();
        setData();
	}, game.UI_REFRESH_INTERVAL);
}

// calculate changes since last calculation.
function calculate() {
    var this_calculation = new Date().getTime();
    var diff = this_calculation - game.last_calculation;
    var sec_since_last = Math.floor(diff / 1000);
    //console.log('calculating for last', sec_since_last);

    // for now, forget about less than 1s. catch is next iteration.
    if (sec_since_last == 0)
        return;

    for (var j = 0; j<sec_since_last; j++) {
        for (var i=0; i < game.items.length; i++) {
            var item = game.items[i];
            var prev = game.prev_map[item];
            var next = game.next_map[item];
            var adjust = game.rate_map[item] * (game.UI_REFRESH_INTERVAL/1000);
            
            //addMessage( [item, item_count_map[item] ] );
            
            game.item_count[ item ] += adjust;
            if (i>0) {
                // take prev (i-1) count divided by BASE^(i+1)
                var newBuild = Math.floor( game.item_count[prev] / Math.pow(game.base,(i+1) ) );
                game.item_count[item] += newBuild;
                updateRate(prev+"_build_rate", newBuild);
                updateNumber(prev, game.item_count[prev]);
            }
            
            updateNumber(item, game.item_count[item]);
            //console.log(""+item_count_map[item], item, "adds", item_count_map[item] * Math.pow(BASE, i+1-game.items.length), 'value');
        }        
    }

    // keep track of the remainder, if any.
    game.last_calculation = this_calculation - (diff - sec_since_last * 1000);
    return total_value;
}


function setData() {
    var total_value = 0;
    for (var i=0; i < game.items.length; i++) {

        var build_rate = Math.floor( game.item_count[game.items[i]] / Math.pow(game.base,(i+2)) );

        updateRate(game.items[i]+"_build_rate", build_rate);
        updateRate(game.items[i]+"_rate", game.rate_map[game.items[i]]);
        updateNumber(game.items[i], game.item_count[game.items[i]]);
        total_value += getItemValue(i);
    }

    updateTotalValue(total_value);
    updateNumber("running", Math.floor( (new Date().getTime() - game.game_started) / 1000));
}

function getItemValue(item_index) {
    return game.item_count[game.items[item_index]] * Math.pow(game.base, item_index+1-game.items.length);
}

function startStateSaver() {
    state_save_timer = setInterval( function(){
        saveState();
    }, game.SAVE_INTERVAL);
}
 
function stopTimer() {

}

function startTimer() {

}

function update_timer_interval( )
{
	clearInterval(global_timer);

	game.UI_REFRESH_INTERVAL = numberFormat( parseInt( document.getElementById("timer").value ) );
	
	startUIUpdater();
}

function reset() {
    // stop timers.
    clearInterval(global_timer);
    clearInterval(state_save_timer);

    for (var i=0; i < game.items.length; i++) {
        game.item_count[game.items[i]] = 0;
        game.rate_map[game.items[i]] = 0;
    }

    setData();

    startUIUpdater();
    startStateSaver();
}

// init from cookies if they are present, bfore starting the timer
init(window.localStorage['builder']);

startUIUpdater();
startStateSaver();

addMessage(['starting prestige is', game.prestige_base+'^'+game.prestige_level,'=', numberFormat(prestigeMultiplier()) ] );
