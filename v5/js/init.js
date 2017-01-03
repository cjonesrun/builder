function initApp() {
	return new App();
}

function buildUI() {

	buildOptionsDiv();

}

//function div(id, className, innerHTML, title, attr_map){

function buildOptionsDiv() {
	var className = "option_button";
	
	

	var options_div = document.getElementById("options_div");
	for (var i=0; i<optionsButtons.length; i++) {
		c=optionsButtons[i];

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