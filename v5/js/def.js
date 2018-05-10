// machine timing constants
var TICK_INTERVAL = 100;
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


// Main Calulator Engine
function Calculator() {
	this.calculate = function() {
		//console.log("calculating", new Date().getTime());
	}
}

// Handle the update of ui components
function UIUpdateController() {
	this.update = function() {
		//console.log("-->updating ui", new Date().getTime());
	}
}

function SaveController() {
	this.save = function() {
		//console.log("---->saving...", new Date().getTime());
	}
}

function EventController() {
	this.handle = function() {

	}
}

// Main App
function Rube(index, calc, ui, save, event) {
	
	var timer_controller = new TimerController(calc, ui, save);
	var calc_controller = calc;
	var save_controllor = save;
	var ui_update = ui;
	var event_controller = event;

	this.index = index;
	this.machines = [];

	this.machines.push(new Machine(0));
	this.machines.push(new Machine(1));
	this.machines.push(new Machine(2));

	this.init = function() {
		console.log("initializing Rube state", this.index);
		timer_controller.startTimers();
	};

	this.getTimerController = function() {
		return timer_controller;
	}
	this.getCalculatorController = function() {
		return calc_controller;
	}
	this.getSaveController = function() {
		return save_controller;
	}
	this.getUIUpdateController = function() {
		return ui_update;
	}
	this.getEventController = function() {
		return event_controller;
	}
}

// Machine
function Machine(index) {
	this.id = 0;
	this.name = "machine0";
	this.components = [];

	this.components.push(new Component(0));
	this.components.push(new Component(1));
	this.components.push(new Component(2));
	this.components.push(new Component(3));
	this.components.push(new Component(4));
	this.components.push(new Component(5));
}

// Components
function Component(index) {
	this.index = index;
}