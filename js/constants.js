function Builder() {
	this.name = "builder";
	this.description = "build. build. build!";
	this.version = 0.1;

	this.SAVE_INTERVAL = 5000;
	this.UI_REFRESH_INTERVAL = 1000;
	this.NUMERICAL_DISPLAY_PRECISION = 5;

	// how much things are slowed down when  accumulating "offline"
	this.warp_reduction = 0.25;

	
	this.game_started = new Date().getTime();    // when this game started
	this.last_calculation = new Date().getTime();
	this.last_save;                           // last time the game was saved  

	this.base = 10;
	this.item_base = 2.4; /*1.3*/
	this.prestige_level = 0;
	this.prestige_base = 2;
	this.min_exponent = -324;	// min exponent is -324

	this.total_value = 0; // current total value
	this.total_value_rate = 0; // total_value rate of change per sec
	this.total_value_accel = 0; // rate of change of total value rate

	// prestige-system
	this.perpetual_machines = [];

	// 5 items
	//this.item_names = [ 'bit', 'part', 'block', 'thing', 'rube goldberg machine' ];
	// 26 items
	this.item_names = [ 'bit', 'part', 'block', 'thing', 'object', 'widget', 'device', 'gear', 'contraption', 'gimmick', 'dingbat', 'utensil', 'gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob', 'whatchamacalit', 'paraphernalia', 'thingamajig', 'apparatus', 'appliance', 'furnishing', 'rig', 'rube goldberg'];

	this.baseCalc = function (pow) {
		return Math.round( this.base * Math.pow(this.item_base, pow));
	};

	// init the game state
	this.map = {};
	for (var i=0; i < this.item_names.length; i++) {
		this.map[i] = {
			"name": this.item_names[i],
			"base": this.baseCalc(i), //this.bases[i],
			"multipliers" : {},
			"count": 0,
			"rate": 0,
			"previous": (i>0) ? i-1 : null,
			"next": (i < this.item_names.length-1) ? i+1 : null,
			"active": i===0 ? true : false
		};		
	}
}

var this_session_start_time = new Date().getTime();
var game = new Builder();

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