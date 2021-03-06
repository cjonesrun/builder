function buildApp() {

	// initialize the main application
	var app = new Rube(0);

	// initialize the controllers
	app.calc_controller = new Calculator(app);
	app.save_controller = new SaveController(app);
	app.ui_update_controller = new UIUpdateController(app);
	app.event_controller = new EventController(app);
	app.timer_controller = new TimerController(app);

	
	app.init();

	console.log(app);

	console.log(Config);
	var json = JSON.stringify(Config);
	console.log(json);	
	Config = JSON.parse(json);
	console.log(Config);


	return app;
}

function buildUI() {

	buildOptionsDiv();
	buildTabBar();
	buildHeader();
	buildMachineDiv();
	buildFooter();
}


function buildMachineDiv(){
	var div = document.getElementById("machines_div");
	
	for (var i=0; i<app.machines.length; i++) {
		//console.log(app.components[0]);
	}
}

function buildOptionsDiv() {
	var className = "option_button";
	
	var options_div = document.getElementById("options_div");
	for (var i=0; i<optionsButtons.length; i++) {
		c=optionsButtons[i];

		var d = div(c[0], className, c[1], c[2]);
		options_div.appendChild(d);

		if (i<optionsButtons.length-1) {
			var e = div("x", "option_button_spacer", "", "");
			options_div.appendChild(e);
		}
	}

	// var x = div("message-wrapper", "top-level-div", "", "", {"data-visible":"false"});
	// options_div.appendChild(x);

	// <!--br>
	// Slider
	// <input type="range" id='tick_rate_slider' min="100" value="100" max="5000" step="100"></input-->
	// <div id="message-wrapper" class="top-level-div" data-visible="false"></div>

}

function buildHeader() {
	var div = document.getElementById("header_div");
	div.innerHTML="header content here";

}

function buildTabBar() {
	var div = document.getElementById("tab_bar_div");
	div.innerHTML="tab content here";

}

function buildFooter() {
	var div = document.getElementById("footer_div");
	div.innerHTML="footer content here";

}
