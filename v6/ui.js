function buildUI() {
	buildResources();
	buildMachines();
	buildControls();

	var robots_container = document.getElementById('robot-container');
	var res_container = document.getElementById('resource-container');
	var controls_container = document.getElementById('controls-container');
	// prevents text select when clicking
	[robots_container, res_container, controls_container].forEach(
		function(div){ div.addEventListener('mousedown', function(e){ e.preventDefault(); }, false); });

}

function buildMachines() {
	var robots_container = document.getElementById('robot-container');

	var header = document.createElement("div");
    header.className = "header";
    header.id = "machine-header";
    header.innerHTML = "Machines"
    robots_container.appendChild(header);

    for (var r in app.robots) {
        if (!isMachine(app.robots[r]))
            continue;

        var r_span = document.createElement("span");
        r_span.setAttribute("id","count-"+r);
        r_span.innerHTML = "0";

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","gather-"+r);
        r_span2.setAttribute("class","info");
        r_span2.innerHTML = "Gathers " + app.robots[r].scrap + "/s";

        var r_btn = document.createElement("div");
        r_btn.setAttribute("operation", "build");
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("id", "build-"+r);
        r_btn.setAttribute("robot", r);
        r_btn.innerHTML = "Build"

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel machine");
        r_div.setAttribute("data-visible", "true");
        
        r_div.innerHTML = app.robots[r].name + ": ";
        r_div.appendChild(r_span);
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_span2);
        r_div.appendChild(document.createElement("br"));
        
        r_div.appendChild(r_btn);

        robots_container.appendChild(r_div);
    }
}

function buildResources(){
	var res_container = document.getElementById('resource-container');

	var header = document.createElement("div");
    header.className = "header";
    header.id = "res-header";
    header.innerHTML = "Resources"
    res_container.appendChild(header);

    for (var r in app.robots) {
        if (isMachine(app.robots[r]))
            continue;

        var r_span = document.createElement("span");
        r_span.setAttribute("id","res-"+r);
        r_span.innerHTML = "0";

        var r_btn = document.createElement("div");
        //r_btn.type = "button";
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("operation", "build");
        r_btn.setAttribute("id", "gather-"+r);
        //r_btn.value = "Gather";
        r_btn.innerHTML = "Gather";
        r_btn.setAttribute("robot", r);

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel res");
        r_div.setAttribute("data-visible", "true");
        
        r_div.innerHTML = app.robots[r].name + ": ";
        r_div.appendChild(r_span);
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_btn);

        res_container.appendChild(r_div);
    }
}

function buildControls(){
	var controls_container = document.getElementById('controls-container');

	var header = document.createElement("div");
    header.className = "header";
    header.id = "controls-header";
    header.innerHTML = "Controls"
    controls_container.appendChild(header);

    var r_div = document.createElement("div");
    r_div.setAttribute("class", "controls");
    r_div.setAttribute("data-visible", "true");

    controlButtons.forEach((x) => {
 		var r_btn = document.createElement("div");
        //r_btn.type = "button";
        r_btn.setAttribute("class", "button panel");
        r_btn.id = x[0];
        r_btn.innerHTML = x[1];
        r_btn.title = x[2];
        
        controls_container.appendChild(r_btn);
    });
}

var controlButtons = [
		['export','Export State','Export Game State'],
		['save-state','Save State','Save Game State to Local Storage'],
		['clear-state','Clear State','Game State from to Local Storage']
		/*["message_button","show","show message box"],
		["pause_button","pause","pause/resume game ticker"],
		["clear_button","clear","clear messages"],
		["export_button","export","export serialized game state to messages"],
		["load_button","load","load serialized game state from messages"],
		["export_json_button","JSON","show game state JSON"],
		["stats","stats","show game stats"],
		["config","config","config rbg parameters"],
		["reset_button","reset","reset game"],
		["hard_reset","hard","blow away local storage"]*/
	];