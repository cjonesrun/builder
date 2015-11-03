var this_session_start_time = new Date().getTime();
var DECIMAL_FORMAT = "0,0.0000";
var MESSAGE_WINDOW_LINES = 20;

var GameModule = function () {

	var NAME = "builder";
	var DESCRIPTION = "build. build. build!";
	var VERSION = 0.1;

	var SAVE_INTERVAL = 5000;
	var UI_REFRESH_INTERVAL = 1000;
	var TICK_INTERVAL = 1000;
	var NUMERICAL_DISPLAY_PRECISION = 5;

	// how much things are slowed down when  accumulating "offline"
	var warp_reduction = 0.25;
	
	var game_started = new Date().getTime();    // when this game started
	var last_calculation = new Date().getTime();
	var last_save;                           // last time the game was saved  

	var base = 10;
	var item_base = 1.3; /*1.3*/
	var min_exponent = -324;	// min exponent is -324

	var cost_calc_base = -4;

	var total_value = 0; // current total value
	var total_value_rate = 0; // total_value rate of change per sec
	var total_value_accel = 0; // rate of change of total value rate

	var pmm = {
		base: 1.01,
		current_level: 0,

		levels: [3, 6, 11, 17, 23, 25],
		//levels: [7, 15, 25],
		activated: false,
		state: []
	};

	var item_names = [ 'bit', 'part', 'block', 'thing', 'object', 'widget', 
						'device', 'gear', 'contraption', 'gimmick', 'dingbat','utensil', 
						'gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob', 
						'whatchamacalit', 'paraphernalia', 'thingamajig','apparatus', 'appliance', 'furnishing', 
						'rig', 'rube goldberg'];	
  	// game state
  	var state = [];
	
	var getNumberOfItems = function () {
		return item_names.length;
	};

	var baseCalc = function (pow) {
		return Math.round( base * Math.pow(item_base, pow));
	};

	var getItemName = function(i){
		return item_names[i];
	}

	var tickRate = function(){
		return 1000 / TICK_INTERVAL;
	}

	// initialize
	for (var i=0; i < item_names.length; i++) {
		state.push( {
			name: item_names[i],
			base: baseCalc(i),
			value: Math.pow(base, min_exponent + parseInt(i) +1),

			upgrades : 1,
			multiplier : (1+i)*Math.pow(base, cost_calc_base) /*Math.pow(base, (i/2+cost_calc_base))*/,
			count: 0,

			rate: 1,
			id: i,
			previous: (i>0) ? i-1 : null,
			next: (i < item_names.length-1) ? i+1 : null,
			active: i===0 ? true : false,
			auto_up: false,
			auto_down: false
		});		
	};

	// expose 'public' methods and vars here. nb. only the vars made public will be serialized to json
	return {
		// public functions
		num_items: getNumberOfItems,
		baseCalc: baseCalc,
		name: getItemName,
		tickRate: tickRate,
		
		// "constants"
		NAME: NAME,
		DESCRIPTION: DESCRIPTION,
		VERSION: VERSION,

		SAVE_INTERVAL: SAVE_INTERVAL,
		UI_REFRESH_INTERVAL: UI_REFRESH_INTERVAL,
		NUMERICAL_DISPLAY_PRECISION: NUMERICAL_DISPLAY_PRECISION,
		TICK_INTERVAL: TICK_INTERVAL,

		// public variables
		game_started: game_started,
		last_calculation: last_calculation,
		last_save: last_save,
		base: base,
		item_base: item_base,
		min_exponent: min_exponent,

		total_value: total_value,
		total_value_rate: total_value_rate,
		total_value_accel: total_value_accel,
		warp_reduction: warp_reduction,

		// game state
		map: state,
		pmm: pmm
	};

}; // END game Module