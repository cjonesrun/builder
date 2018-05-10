// Timer Controller
function TimerController(calc_cont, ui_cont, save_cont) {
	var tick_state, ui_state, save_state;
	var calc_controller = calc_cont;
	var ui_controller = ui_cont;
	var save_controller = save_cont;

	var started = false;

	// private
	function tick() {
		calc_controller.calculate();
	
		tick_state = setTimeout(tick, TICK_INTERVAL);
	}

	// private
	function ui() {
		ui_controller.update();
	
		ui_state = setTimeout(ui, UI_REFRESH_INTERVAL);
	}

	// private
	function save() {
		save_controller.save();
		save_state = setTimeout(save, SAVE_INTERVAL);
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
	}
}