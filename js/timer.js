
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
    var sec_since_last = Math.floor(diff / 1000); // time in s since last calc
    console.log('calculating for last', sec_since_last);

    // for now, forget about less than 1s. catch is tick
    if (sec_since_last == 0)
        return;

    var total_value = 0;
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
            }

            if (j == sec_since_last -1)
                total_value += getItemValue(i);
        }        
    }

    if (sec_since_last > game.UI_REFRESH_INTERVAL * 5 / 1000) // a bit arbitrary, but if calc hasn't run in 5 ticks, assume no activity
        addMessage(['welcome back. you\'ve been gone for', sec_since_last, 'seconds. value has warped ahead by', numberFormat( total_value - game.total_value ) ]);
    
    // set game total
    game.total_value = total_value;

    // keep track of the remainder, if any.
    game.last_calculation = this_calculation - (diff - sec_since_last * 1000);
}


function setData() {
    for (var i=0; i < game.items.length; i++) {

        var build_rate = Math.floor( game.item_count[game.items[i]] / Math.pow(game.base,(i+2)) );

        updateRate(game.items[i]+"_build_rate", build_rate);
        updateRate(game.items[i]+"_rate", game.rate_map[game.items[i]]);
        updateNumber(game.items[i], game.item_count[game.items[i]]);
    }

    updateTotalValue(game.total_value);
    updateNumber("running", Math.floor( (new Date().getTime() - game.game_started) / 1000));
}

function getItemValue(item_index) {
    //console.log(game.items[item_index], game.item_count[game.items[item_index]], Math.pow(game.base, item_index+1-game.items.length) );
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

    game = new Builder();
   
    setData();

    startUIUpdater();
    startStateSaver();
}

// init from cookies if they are present, bfore starting the timer
init(window.localStorage['builder']);

addMessage(['starting prestige is', game.prestige_base+'^'+game.prestige_level,'=', numberFormat(prestigeMultiplier()) ] );
