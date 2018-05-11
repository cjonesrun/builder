// Timer Controller
function TimerController(application) {
	var tick_state, ui_state, save_state;
	var app = application;

	var started = false;

	// private
	function tick() {
		app.calc_controller.calculate();
		tick_state = setTimeout(tick, Config.TICK_INTERVAL);
	}

	// private
	function ui() {
		app.ui_update_controller.update();
		ui_state = setTimeout(ui, Config.UI_REFRESH_INTERVAL);
	}

	// private
	function save() {
		app.save_controller.save();
		save_state = setTimeout(save, Config.SAVE_INTERVAL);
	}

	// public
	this.startTimers = function() {
		if (typeof ui_state != "number") {
	    	ui();
	    }
	    if (typeof save_state != "number") {
	    	save();
	    }
	    if (typeof tick_state != "number") {
        	tick();
	    }
	    started = true;
	}

	// public
	this.stopTimers = function() {
		if (typeof tick_state == "number") {
	        clearTimeout(tick_state);
	        tick_state = false;
	    }
		if (typeof ui_state == "number") {
	        clearTimeout(ui_state);
	        ui_state = false;
	    }
	    if (typeof save_state == "number") {
	        clearTimeout(save_state);
	        save_state = false;
	    }
	    started = false;
	}

	this.toggleTimers = function() {
		if (started) {
			this.stopTimers();
		} else {
			this.startTimers();
		}
		console.log("timers running:", started);
		return started;
	}
}