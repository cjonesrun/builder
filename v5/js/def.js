
var  Config = {
	TICK_INTERVAL: 100,
	UI_REFRESH_INTERVAL: 1000,
	SAVE_INTERVAL: 5000,

	// machine math constants
	GAME_BASE: 10,
	PMM_BASE: 1.3,
	ITEM_BASE: 1.4,

	MACHINE_MATH_MODE: MATH_MODE["EXPONENTIAL"]
}

// Main Calulator Engine
function Calculator(a) {
	var app = a;

	this.calculate = function() {
		var now = new Date().getTime();
		//console.log("calculating", new Date().getTime());
		for (var i=0; i<app.machines.length; i++) {
			app.machines[i].calculate(app.last_tick, now);
		}
		app.last_tick = now;
	}	
}

// Handle the update of ui components
function UIUpdateController(a) {
	this.app = a;
	this.update = function() {
		//console.log("-->updating ui", new Date().getTime());
	}
}

function SaveController(a) {
	this.app = a;
	this.save = function() {
		//console.log("---->saving...", new Date().getTime());

	}
}

function EventController(a) {
	this.app = a;
	this.handle = function() {
		//console.log("handling event", new Date().getTime());
	}
}

// Main App
function Rube(index) {
	this.calc_controller;
	this.save_controller;
	this.ui_update_controller;
	this.event_controller;
	this.timer_controller;

	this.last_save = new Date().getTime();
	this.last_tick = new Date().getTime();
	this.index = index;
	this.machines = [];

	this.machines.push(new Machine(0));
	this.machines.push(new Machine(1));
	this.machines.push(new Machine(2));

	this.init = function() {
		console.log("initializing Rube state", this.index);
		this.timer_controller.startTimers();
	};
}

// Machine
function Machine(index) {
	this.id = index;
	this.name = "machine"+index;
	this.components = [];

	this.components.push(new Component(0));
	this.components.push(new Component(1));
	this.components.push(new Component(2));
	this.components.push(new Component(3));
	this.components.push(new Component(4));
	this.components.push(new Component(5));

	this.calculate = function(last_tick, now) {
		//console.log("calculating for", (now - last_tick), "ms");

		//console.log("calculating new state from", state, "from", engine.last_save, "to", now, "diff",(now-engine.last_save), "ms.");
		//console.log("accumulating", (state.state.rate / 1000), "units/ms over", (now-engine.last_save), "ms totalling", ((state.state.rate / 1000 ) * (now-engine.last_save)));
		for (var i=0; i < this.components.length; i++) {
			//this.components[i].calc( now - last_tick );
		}

	}
}

// Components
function Component(index) {
	this.index = index;

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