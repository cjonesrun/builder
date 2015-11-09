var ui_timer; // main timer for auto block & thing building
var state_save_timer;
var calclator_timer;

function runCalculator(){
    calculate();
    calculor_time = setTimeout(runCalculator, game.TICK_INTERVAL);
}

function runUIUpdater(){
    updateUI();
    ui_timer = setTimeout(runUIUpdater, game.UI_REFRESH_INTERVAL);
}

function startStateSaver() {
    state_save_timer = setInterval( function(){
        saveState();
    }, game.SAVE_INTERVAL);
}

function stopTimers() {
    if (typeof ui_timer == "number") {
        //console.log('stopping ui_timer', ui_timer);
        clearTimeout(ui_timer);
        ui_timer = false;
    } /*else
        console.log('ui_timer already stopped', ui_timer);*/

    if (typeof calclator_timer == "number") {
        clearTimeout(calclator_timer);
        calclator_timer = false;
    }

    if (typeof state_save_timer == "number") {
        //console.log('stopping state_save_timer', state_save_timer);
        clearTimeout(state_save_timer);
        state_save_timer = false;
    } /* else
        console.log('ui_timer already stopped', state_save_timer); */
}

function startTimers() {
    if (typeof ui_timer != "number") {
        //console.log('starting ui_timer', ui_timer);
        game.last_calculation = new Date().getTime();
        runUIUpdater();
    } /* else
        console.log('ui_timer already started', ui_timer); */

    if (typeof calclator_timer != "number") {
        runCalculator();
    }

    if (typeof state_save_timer != "number") {
        //console.log('starting state_save_timer', state_save_timer);
        startStateSaver();
    } /* else
        console.log('state_save_timer already started', state_save_timer); */
}

function update_timer_interval( )
{
	clearInterval(ui_timer);

	game.UI_REFRESH_INTERVAL = numberFormat( parseInt( document.getElementById("timer").value ) );
	
	startUIUpdater();
}

function pauseResume(button)
{
    //console.log('state_save_timer', state_save_timer, button);
    if (ui_timer) {
        addMessage( ['pausing timers.'] );
        button.innerHTML = 'resume';
        stopTimers();
    } else {
        addMessage( ['resuming timers.'] );
        button.innerHTML = 'pause';
        startTimers();
    }
}

