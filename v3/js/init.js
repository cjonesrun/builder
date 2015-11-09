// instantiate the game
var game = new BuilderModule();
var pmm = new PerpetualMotionModule();

function builderInit() {
    stopTimers();
    
    updateUI();

    startTimers();
}

// init from localstorage if present, before building ui & starting the timer
var gstate = getFromLocalStorage(game.NAME);
game = extend(new BuilderModule(), gstate===null?new BuilderModule():gstate);

var pstate = getFromLocalStorage(pmm.NAME);
pmm = extend(new PerpetualMotionModule(), pstate===null?new PerpetualMotionModule():pstate);

builderInit();