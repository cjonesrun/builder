var global_timer; // main timer for auto block & thing building
var state_save_timer;

function startUIUpdater() {
    global_timer = setInterval(function(){ 
        calculate();
        setData();
	}, game.UI_REFRESH_INTERVAL);
}

function startStateSaver() {
    state_save_timer = setInterval( function(){
        saveState();
    }, game.SAVE_INTERVAL);
}

function stopTimers() {
    if (typeof global_timer == "number") {
        //console.log('stopping global_timer', global_timer);
        clearInterval(global_timer);
        global_timer = false;
    } /*else
        console.log('global_timer already stopped', global_timer);*/

    if (typeof state_save_timer == "number") {
        //console.log('stopping state_save_timer', state_save_timer);
        clearInterval(state_save_timer);
        state_save_timer = false;
    } /* else
        console.log('global_timer already stopped', state_save_timer); */
}

function startTimers() {
    if (typeof global_timer != "number") {
        //console.log('starting global_timer', global_timer);
        startUIUpdater();
    } /* else
        console.log('global_timer already started', global_timer); */

    if (typeof state_save_timer != "number") {
        //console.log('starting state_save_timer', state_save_timer);
        startStateSaver();
    } /* else
        console.log('state_save_timer already started', state_save_timer); */
}

function update_timer_interval( )
{
	clearInterval(global_timer);

	game.UI_REFRESH_INTERVAL = numberFormat( parseInt( document.getElementById("timer").value ) );
	
	startUIUpdater();
}

function pauseResume()
{
    //console.log('state_save_timer', state_save_timer);
    if (global_timer) {
        addMessage( ['pausing timers.'] );
        stopTimers();
    } else {
        addMessage( ['resuming timers.'] );
        startTimers();
    }
}

