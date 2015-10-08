
var this_session_start_time = new Date().getTime();
var game_started = new Date().getTime();    // when this game started
var last_save;                              // last time the game was saved  

var global_timer; // main timer for auto block & thing building
var cookie_save_timer;



function startUIUpdater() {
    global_timer = setInterval(function(){ 
    	/*var total_value = 0.0;

        for (var i=0; i < items_arr.length; i++) {
            var item = items_arr[i];
            var prev = prev_map[item];
            var next = next_map[item];
            var adjust = rate_map[item] * (UI_REFRESH_INTERVAL/1000);
            
            //addMessage( [item, item_count_map[item] ] );
            
            item_count_map[ item ] += adjust;
            if (i>0) {
                // take prev (i-1) count divided by BASE^(i+1)
                var newBuild = Math.floor( item_count_map[prev] / Math.pow(BASE,(i+1) ) );
                item_count_map[item] += newBuild;
                updateRate(prev+"_build_rate", newBuild);
                updateNumber(prev, item_count_map[prev]);
            }
            
            updateNumber(item, item_count_map[item]);
            //console.log(""+item_count_map[item], item, "adds", item_count_map[item] * Math.pow(BASE, i+1-items_arr.length), 'value');
            total_value += getItemValue(i);
        }
       
        updateTotalValue(total_value);
		updateNumber("running", Math.floor( (new Date().getTime() - game_started) / 1000));*/
        calculate();
        setData();


	}, UI_REFRESH_INTERVAL);
}

var last_calculation = new Date().getTime();
// calculate changes since last calculation.
function calculate() {
    var this_calculation = new Date().getTime();
    var sec_since_last = Math.floor((this_calculation - last_calculation) / 1000);
    //console.log('calculating for last', sec_since_last);

    // for now, forget about less than 1s. catch is next iteration.
    if (sec_since_last == 0)
        return;

    for (var j = 0; j<sec_since_last; j++) {
        for (var i=0; i < items_arr.length; i++) {
            var item = items_arr[i];
            var prev = prev_map[item];
            var next = next_map[item];
            var adjust = rate_map[item] * (UI_REFRESH_INTERVAL/1000);
            
            //addMessage( [item, item_count_map[item] ] );
            
            item_count_map[ item ] += adjust;
            if (i>0) {
                // take prev (i-1) count divided by BASE^(i+1)
                var newBuild = Math.floor( item_count_map[prev] / Math.pow(BASE,(i+1) ) );
                item_count_map[item] += newBuild;
                updateRate(prev+"_build_rate", newBuild);
                updateNumber(prev, item_count_map[prev]);
            }
            
            updateNumber(item, item_count_map[item]);
            //console.log(""+item_count_map[item], item, "adds", item_count_map[item] * Math.pow(BASE, i+1-items_arr.length), 'value');
        }        
    }

    last_calculation = this_calculation;
    return total_value;
}


function setData() {
    var total_value = 0;
    for (var i=0; i < items_arr.length; i++) {

        var build_rate = Math.floor( item_count_map[items_arr[i]] / Math.pow(BASE,(i+2)) );

        updateRate(items_arr[i]+"_build_rate", build_rate);
        updateRate(items_arr[i]+"_rate", rate_map[items_arr[i]]);
        updateNumber(items_arr[i], item_count_map[items_arr[i]]);
        total_value += getItemValue(i);
    }

    updateTotalValue(total_value);
    updateNumber("running", Math.floor( (new Date().getTime() - game_started) / 1000));
}

function getItemValue(item_index) {
    return item_count_map[items_arr[item_index]] * Math.pow(BASE, item_index+1-items_arr.length);
}

function startCookieSaver() {
    cookie_save_timer = setInterval( function(){
        saveState();
    }, SAVE_INTERVAL);
}
 
function stopTimer() {

}

function startTimer() {

}

function update_timer_interval( )
{
	clearInterval(global_timer);

	UI_REFRESH_INTERVAL = numberFormat( parseInt( document.getElementById("timer").value ) );
	
	startUIUpdater();
}

function reset() {
    // stop timers.
    clearInterval(global_timer);
    clearInterval(cookie_save_timer);

    for (var i=0; i < items_arr.length; i++) {
        item_count_map[items_arr[i]] = 0;
        rate_map[items_arr[i]] = 0;
    }

    setData();

    startUIUpdater();
    startCookieSaver();
}

// init from cookies if they are present, bfore starting the timer
initFromCookies(document.getCookie("state"));

startUIUpdater();
startCookieSaver();

addMessage(['starting prestige is', PRESTIGE_BASE+'^'+PRESTIGE_LEVEL,'=', numberFormat(prestigeMultiplier()) ] );
