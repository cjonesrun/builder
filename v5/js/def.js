// machine timing constants
var TICK_INTERVAL = 1000;
var UI_REFRESH_INTERVAL = 1000;
var SAVE_INTERVAL = 5000;

// machine math constants
var GAME_BASE = 10;
var PMM_BASE = 1.3;
var ITEM_BASE = 1.4;

var MACHINE_MATH_MODE = MATH_MODE["EXPONENTIAL"];

// Main App
function Machine2() {
	// constants
	this.NAME = "RGM";
	
	this.MATH = MATH_MODE.LINEAR;

	this.last_save = new Date().getTime();
	this.pmm_defs = [];
	
	this.pmm_defs.push(
		new PerpetualMotionMachine(0, machineParts.splice(0,6))
	);
}


function Engine() {
	this.last_save = new Date().getTime();
}

Engine.prototype.calculate = function(machine) {
	var now = new Date().getTime();

	//console.log("calculating new state from", state, "from", engine.last_save, "to", now, "diff",(now-engine.last_save), "ms.");
	//console.log("accumulating", (state.state.rate / 1000), "units/ms over", (now-engine.last_save), "ms totalling", ((state.state.rate / 1000 ) * (now-engine.last_save)));
	for (var i=0; i < machine.components.length; i++) {
		machine.components[i].calc( now - engine.last_save );
	}
	this.last_save = now;
};

function UIUpdate() {
	this.update = function() {
		console.log("updating UI", machine);	
	}
}


function Machine() {
	this.id = 0;
	this.name = "machine0";
	this.components = [];

	this.components.push(new State(0));
	this.components.push(new State(1));
	this.components.push(new State(2));
}

function State(i) {
	this.id = i;
	this.calc = function (ms) {
		var delta = (this.production_rate/1000) * ms;
		delta *= this.production_rate_multiplier;

		this.count += delta;
	}

	this.build = function(how_many) {
		var delta = how_many * this.manual_build_multiplier;
		this.count += delta;
	}

	this.count = 0;
	this.production_rate = 1.7;
	this.production_rate_multiplier = 1;
	this.manual_build_multiplier = 1;
}

var calc_timer, ui_timer;
var t1, t2;

function calc_timer() {
	
	engine.calculate(machine);
	
	t1 = setTimeout(calc_timer, TICK_INTERVAL);
}

function ui_timer() {	
	ui_update.update();

	t2 = setTimeout(ui_timer, UI_REFRESH_INTERVAL);
}

// timers
function startTimers() {
	if (typeof t2 != "number") {
        ui_timer();
    }
	if (typeof t1 != "number") {
    	calc_timer();
    }
}

function pauseTimers() {
	if (typeof t1 == "number") {
        clearTimeout(t1);
        t1 = false;
    }

	if (typeof t2 == "number") {
        clearTimeout(t2);
        t2 = false;
    }
}

function toggleTimers() {
	if (typeof t2 != "number") {
        ui_timer();
    } else {
 		clearTimeout(t2);
		t2 = false;
    }

	if (typeof t1 != "number") {
    	calc_timer();
    } else {
		clearTimeout(t1);
		t1 = false;
    }

}




var engine = new Engine();
var machine = new Machine(0);
var ui_update = new UIUpdate();

startTimers();