
var this_session_start_time = new Date().getTime();
var game_started = new Date().getTime();    // when this game started
var last_save;                              // last time the game was saved  

var global_timer; // main timer for auto block & thing building
var cookie_save_timer;



function startUIUpdater() {
    global_timer = setInterval(function(){ 
    	var total_value = 0.0;

        for (var i=0; i < items_arr.length; i++) {
            var item = items_arr[i];
            var prev = prev_map[item];
            var next = next_map[item];
            var adjust = rate_map[item] * (UI_REFRESH_INTERVAL/1000);
            
            //addMessage( [item, item_count_map[item] ] );
            
            item_count_map[ item ] += adjust;
            if (i>0) {
                var newBuild = Math.floor( item_count_map[prev] / Math.pow(BASE,(i+1)) );
                item_count_map[item] += newBuild;
                getElement(prev+"_build_rate").value = numberFormat(newBuild) + '/s';
                getElement(prev).value = numberFormat(item_count_map[prev]);
            }
            
            getElement(item).value = numberFormat(item_count_map[item]);
            //console.log("adding", item_count_map[item] * Math.pow(BASE, i+1-items_arr.length), 'value from', item);
            total_value += getItemValue(item);
        }
       
        getElement("total_value").value = prettyNumber(total_value);
		getElement("running").value =  numberFormat(Math.floor( (new Date().getTime() - game_started) / 1000));

	}, UI_REFRESH_INTERVAL);
}

function prettyNumber(number) {
    console.log("max number", Number.MAX_VALUE);

    var d1 = new Decimal(12345678);

    console.log(d1 + new Decimal(12345));
    return number;
}

function setData() {
    var total_value = 0;
    for (var i=0; i < items_arr.length; i++) {

        var build_rate = Math.floor( item_count_map[items_arr[i]] / Math.pow(BASE,(i+2)) );

        getElement(items_arr[i]+"_build_rate").value = numberFormat(build_rate) + '/s';
        getElement(items_arr[i]+"_rate").value = numberFormat(rate_map[items_arr[i]]) + '/s';
        getElement(items_arr[i]).value = numberFormat(item_count_map[items_arr[i]]);

        total_value += getItemValue(items_arr[i]);
    }

    getElement("total_value").value = new Decimal(""+numberFormat(total_value));
}

function getItemValue(item) {
    return item_count_map[item] * Math.pow(BASE, i+1-items_arr.length);
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
