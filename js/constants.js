function Builder() {
	this.SAVE_INTERVAL = 5000;
	this.UI_REFRESH_INTERVAL = 1000;

	this.NUMERICAL_DISPLAY_PRECISION = 5;

	this.name = "Builder";
	this.description = "Build. Build. Build.";
	this.version = 0.1;

	this.game_started = new Date().getTime();    // when this game started
	this.last_calculation = new Date().getTime();
	this.last_save;                           // last time the game was saved  

	this.base = 10;
	this.bases = {};

	this.prestige_level = 0;
	this.prestige_base = 2;

	this.total_value = 0;

	this.items = [ 'bit', 'part', 'block', 'thing', 'object', 'widget', 'device', 'gear', 'contraption', 'gimmick', 'dingbat', 'utensil', 'gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob', 'whatchamacalit', 'paraphernalia', 'thingamajig', 'apparatus', 'appliance', 'furnishing', 'rig', 'rube goldberg machine' ];
	this.item_count = {};
	this.rate_map = {};
	this.prev_map = {};
	this.next_map = {};

	for (var i=0; i < this.items.length; i++) {
		if (i > 0) 
			this.prev_map[this.items[i]] = this.items[i-1];
		if (i < this.items.length-1)
			this.next_map[this.items[i]] = this.items[i+1];

		// init the maps to zeros
		this.rate_map[this.items[i]] = 0;
		this.item_count[this.items[i]] = 0;

		this.bases[this.items[i]] = 5 + Math.floor((Math.random() * 10) + 1) % 7;		
	}
}

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
	if (lines.length > 15) {
		dump = '';
		for (var i =0; i<15; i++)
			dump += lines[i] +'\n'; 
	}
	messagesWindow.value = dump;

	//console.log( (messagesWindow.value.match(/\n/g) || []).length);
	// TODO: trim the log to, say, 1,000 characters
}