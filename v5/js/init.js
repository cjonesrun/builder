function initApp() {
	return new App();
}

function buildUI() {

	buildOptionsDiv();

}

//function div(id, className, innerHTML, title, attr_map){

function buildOptionsDiv() {
	var className = "option_button";
	
	// id, innerHTML, title
	var options = [
		["message_button","show messages","show message box"],
		["pause_button","pause","pause/resume game ticker"],
		["save_button","save","save game state"],
		["clear_button","clear messages","clear messages"],
		["export_button","export","export serialized game state to messages"],
		["load_button","load","load serialized game state from messages"],
		["export_json_button","JSON","show game state JSON"],
		["stats","stats","show game stats"],
		["config","config","config rbg parameters"],
		["reset_button","reset","reset game"],
		["hard_reset","hard","blow away local storage"]
	];

	var options_div = document.getElementById("options_div");
	for (var i=0; i<options.length; i++) {
		c=options[i];

		var d = div(c[0], className, c[1], c[2]);
		options_div.appendChild(d);
	}

	// var x = div("message-wrapper", "top-level-div", "", "", {"data-visible":"false"});
	// options_div.appendChild(x);

	// <!--br>
	// Slider
	// <input type="range" id='tick_rate_slider' min="100" value="100" max="5000" step="100"></input-->
	// <div id="message-wrapper" class="top-level-div" data-visible="false"></div>

}