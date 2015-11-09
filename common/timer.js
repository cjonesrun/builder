var ui_timer; // main timer for auto block & thing building
var state_save_timer;
var calculator_timer;

function runCalculator(){
    calculate();
    //console.log('calculating');
    calculator_timer = setTimeout(runCalculator, game.TICK_INTERVAL);
}

function runUIUpdater(){
    updateUI();
    //console.log('updating');
    ui_timer = setTimeout(runUIUpdater, game.UI_REFRESH_INTERVAL);
}

function runStateSaver() {
    game.last_save = new Date().getTime();

    saveState();
    //console.log('saving');
    state_save_timer = setTimeout(runStateSaver, game.SAVE_INTERVAL);
}

function stopTimers() {
    if (typeof ui_timer == "number") {
        clearTimeout(ui_timer);
        ui_timer = false;
    }

    if (typeof calculator_timer == "number") {
        clearTimeout(calculator_timer);
        calculator_timer = false;
    }

    if (typeof state_save_timer == "number") {
        clearTimeout(state_save_timer);
        state_save_timer = false;
    }
}

function startTimers() {
    if (typeof ui_timer != "number") {
        //console.log('starting ui_timer', ui_timer);
        game.last_calculation = new Date().getTime();
        runUIUpdater();
    } /* else
        console.log('ui_timer already started', ui_timer); */

    if (typeof calculator_timer != "number") {
        runCalculator();
    }

    if (typeof state_save_timer != "number") {
        //console.log('starting state_save_timer', state_save_timer);
        runStateSaver();
    } /* else
        console.log('state_save_timer already started', state_save_timer); */
}

function pauseResume(button)
{
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

