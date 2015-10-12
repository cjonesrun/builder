
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
        if (mins > 0) mins + "m "
        str += seconds + "s"
        addMessage(['welcome back. you\'ve been gone for', str+'.', 'value has warped ahead by', numberFormat( total_value - game.total_value ) ]);
    }
    // set game total
    game.total_value = total_value;

    // keep track of the remainder, if any.
    game.last_calculation = this_calculation - (diff - sec_since_last * 1000);
}


function setData() {
    var prev_build_rate = 0;
    for (var i=0; i < game.item_names.length; i++) {

        var build_rate = Math.floor( game.map[i].count / Math.pow(game.map[i].base,(i+2)) );

        updateRate(i+"_build_rate", build_rate);
        updateRate(i+"_rate", game.map[i].rate);
        updateNumber(i+"_count", game.map[i].count);

        updateItemInfo(i, game.map[i].rate + prev_build_rate)
        
        prev_build_rate = build_rate;
    }

    updateTotalValue(game.total_value);
    updateNumber("running", Math.floor( (new Date().getTime() - game.game_started) / 1000));
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
    //console.log(JSON.stringify(game));
   
    saveState();
    setData();

    setMessage( [] );

    startUIUpdater();
    startStateSaver();
}

// init from cookies if they are present, bfore starting the timer
init(window.localStorage['builder']);

addMessage(['starting prestige is', game.prestige_base+'^'+game.prestige_level,'=', numberFormat(prestigeMultiplier()) ] );

