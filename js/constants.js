var this_session_start_time = new Date().getTime();

var GameModule = function () {

	var NAME = "builder";
	var DESCRIPTION = "build. build. build!";
	var VERSION = 0.1;

	var SAVE_INTERVAL = 5000;
	var UI_REFRESH_INTERVAL = 1000;
	var NUMERICAL_DISPLAY_PRECISION = 5;

	// how much things are slowed down when  accumulating "offline"
	var warp_reduction = 0.25;

	
	var game_started = new Date().getTime();    // when this game started
	var last_calculation = new Date().getTime();
	var last_save;                           // last time the game was saved  

	var base = 10;
	var item_base = 1.7; /*1.3*/
	var prestige_level = 0;
	var prestige_base = 2;
	var min_exponent = -324;	// min exponent is -324

	var total_value = 0; // current total value
	var total_value_rate = 0; // total_value rate of change per sec
	var total_value_accel = 0; // rate of change of total value rate

	// prestige-system
	var perpetual_motion_machine_levels = [3, 6, 11, 17, 23, 25];
	var perpetual_motion_activated = false;

	var item_names = [ 'bit', 'part', 'block', 'thing', 'object', 'widget', 
						'device', 'gear', 'contraption', 'gimmick', 'dingbat','utensil', 
						'gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob', 
						'whatchamacalit', 'paraphernalia', 'thingamajig','apparatus', 'appliance', 'furnishing', 
						'rig', 'rube goldberg'];
	
	var getNumberOfItems = function () {
		return item_names.length;
	};

	var baseCalc = function (pow) {
		return Math.round( base * Math.pow(item_base, pow));
	};
  
  	var state = [];
	for (var i=0; i < item_names.length; i++) {
		state.push( {
			name: item_names[i],
			base: baseCalc(i),
			multipliers : [],
			count: 0,
			rate: 0,
			id: i,
			previous: (i>0) ? i-1 : null,
			next: (i < item_names.length-1) ? i+1 : null,
			active: i===0 ? true : false
		});		
	};

	// expose 'public' methods and vars here. nb. only the vars made public will be serialized to json
	return {
		// public functions
		num_items: getNumberOfItems,
		baseCalc: baseCalc,
		
		// "constants"
		NAME: NAME,
		DESCRIPTION: DESCRIPTION,
		VERSION: VERSION,

		SAVE_INTERVAL: SAVE_INTERVAL,
		UI_REFRESH_INTERVAL: UI_REFRESH_INTERVAL,
		NUMERICAL_DISPLAY_PRECISION: NUMERICAL_DISPLAY_PRECISION,

		// public variables
		prestige_level: prestige_level,
		prestige_base: prestige_base,
		perpetual_motion_machine_levels: perpetual_motion_machine_levels,

		
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
		map: state
	};

}; // END game Module

var game = new GameModule();
console.log(JSON.stringify(game));

console.log("from constants.js", game.map, game.baseCalc(10), game.num_items);

var messagesWindow;
function setMessage(str_arr) {
	addMessage(str_arr, true);
}

function addMessage(str_arr, clearFirst){
	if (!messagesWindow)
		messagesWindow = document.getElementById( 'messages' );
	var dump = str_arr.join(" ");

	if (!clearFirst)
		dump += "\n" + messagesWindow.value;

	var lines = dump.split("\n");
	if (lines.length > 20) {
		dump = '';
		for (var i =0; i<20; i++)
			dump += lines[i] +'\n'; 
	}
	messagesWindow.value = dump;

	//console.log( (messagesWindow.value.match(/\n/g) || []).length);
	// TODO: trim the log to, say, 1,000 characters
}

function clearMessages() {
	if (!messagesWindow)
		messagesWindow = document.getElementById( 'messages' );
	setMessage( [] );
}