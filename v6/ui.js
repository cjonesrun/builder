function buildUI() {
	buildResources();
    buildGenerators();
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
        if (r.type != TYPE.MACHINE)
            continue;

        var r_span = document.createElement("span");
        r_span.setAttribute("id","count-"+r);
        r_span.innerHTML = "0";

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","gather-"+r);
        r_span2.setAttribute("class","info");
        r_span2.innerHTML = "Gathers X/s";

        var r_btn = document.createElement("div");
        r_btn.setAttribute("operation", "build");
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("id", "build-"+r);
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", app.robots[r].build_cost.length > 0);
        r_btn.innerHTML = "Build";

        var r_btn2 = document.createElement("div");
        r_btn2.setAttribute("operation", "build-all");
        r_btn2.setAttribute("class", "button panel");
        r_btn2.setAttribute("id", "build-all-"+r);
        r_btn2.setAttribute("robot", r);
        r_btn2.setAttribute("data-visible", app.robots[r].build_cost.length > 0);
        r_btn2.innerHTML = "Build All";

        var r_btn3 = document.createElement("div");
        r_btn3.setAttribute("operation", "build-half");
        r_btn3.setAttribute("class", "button panel");
        r_btn3.setAttribute("id", "build-half-"+r);
        r_btn3.setAttribute("robot", r);
        r_btn3.setAttribute("data-visible", app.robots[r].build_cost.length > 0);
        r_btn3.innerHTML = "Build Half";

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel machine");
        r_div.setAttribute("data-visible", "true");
        
        r_div.innerHTML = app.robots[r].name + ": ";
        r_div.appendChild(r_span);
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_span2);
        r_div.appendChild(document.createElement("br"));
        
        r_div.appendChild(r_btn);
        r_div.appendChild(r_btn3);
        r_div.appendChild(r_btn2);

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
        if (r.type != TYPE.RESOURCE)
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
        r_btn.setAttribute("data-visible", app.robots[r].build_cost.length > 0);

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel res");
        
        r_div.innerHTML = app.robots[r].name + ": ";
        r_div.appendChild(r_span);
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_btn);

        res_container.appendChild(r_div);
    }
}

function buildGenerators(){
    var res_container = document.getElementById('generator-container');

    var header = document.createElement("div");
    header.className = "header";
    header.id = "gen-header";
    header.innerHTML = "Generators"
    res_container.appendChild(header);

    for (var r in app.robots) {
        if (r.type != TYPE.GENERATOR)
            continue;

        var r_span = document.createElement("span");
        r_span.setAttribute("id","gen-"+r);
        r_span.innerHTML = "0";

        var r_btn = document.createElement("div");
        //r_btn.type = "button";
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("operation", "generate");
        r_btn.setAttribute("id", "generate-"+r);
        //r_btn.value = "Gather";
        r_btn.innerHTML = "Gather";
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", app.robots[r].build_cost.length > 0);

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel gen");
        
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


function updateUIResource(r) {
    console.log("updating", r.type, r.id);
}

function updateUIMachine(robot) {
    console.log("updating", robot.type, robot.id);

    var y = "Gathers ";
    robot.produces.forEach((x) => {
        y += "["+ nf(x.qty) + " " + x.id+"/s] ";
    });
    y = y.trim();
    
    console.log("count-"+robot.id);
    document.querySelector("#count-"+robot.id).innerHTML = nf(robot.count);
    document.querySelector("#gather-"+robot.id).innerHTML = y;
    //document.querySelector("#gather-"+robotid).innerHTML = "Gathers " + nf(robot.produces.qty) +" " +r2.name 
    //    + "/s [Total: " + nf(y) + "/s]";

    y = "";
    var enabled = true;
    robot.build_cost.forEach((x) => {
        y += "["+ nf(x.qty) + " " + app.robots[x.id].name +"] ";
        enabled = enabled && (x.qty.lte(app.robots[x.id].count));
    });
    y = y.trim();

    [document.querySelector("#build-"+robotid), document.querySelector("#build-all-"+robotid), document.querySelector("#build-half-"+robot.id)]
        .forEach((x) => {
            x.title = "costs " + y;
            x.setAttribute("button-disabled", !enabled); 
        });
}

function updateUIGenerator(r) {
    console.log("updating", r.type, r.id);
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