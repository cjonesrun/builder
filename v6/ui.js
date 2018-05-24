function buildUI() {
	buildResources();
    buildGenerators();
	buildMachines();
	buildControls();

	// prevents text select when clicking within each container
	document.querySelectorAll(".container").forEach(
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
        var robot = app.robots[r];
        if (robot.type != TYPE.MACHINE)
            continue;

        var r_span = document.createElement("span");
        r_span.setAttribute("id","machine-count-"+r);
        r_span.innerHTML = nf(robot.count);

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","machine-info-"+r);
        r_span2.setAttribute("class","info");

        var r_btn = document.createElement("div");
        r_btn.setAttribute("operation", "build");
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("id", "machine-build-"+r);
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", robot.build_cost.length > 0);
        r_btn.innerHTML = "Build";

        var r_btn2 = document.createElement("div");
        r_btn2.setAttribute("operation", "build-max");
        r_btn2.setAttribute("class", "button panel");
        r_btn2.setAttribute("id", "machine-build-max-"+r);
        r_btn2.setAttribute("robot", r);
        r_btn2.setAttribute("data-visible", robot.build_cost.length > 0);
        r_btn2.innerHTML = "Build Max";

        var t = document.createElement("span");
        t.setAttribute("id","machine-build-max-count-"+r);
        t.setAttribute("operation", "build-max");
        t.setAttribute("robot", r);
        r_btn2.appendChild(t)

        var r_btn3 = document.createElement("div");
        r_btn3.setAttribute("operation", "build-half");
        r_btn3.setAttribute("class", "button panel");
        r_btn3.setAttribute("id", "machine-build-half-"+r);
        r_btn3.setAttribute("robot", r);
        r_btn3.setAttribute("data-visible", robot.build_cost.length > 0);
        r_btn3.innerHTML = "Build Half";

        t = document.createElement("span");
        t.setAttribute("id","machine-build-half-count-"+r);
        t.setAttribute("operation", "build-half");
        t.setAttribute("robot", r);
        r_btn3.appendChild(t);

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel machine");
        r_div.setAttribute("data-visible", "true");
        
        r_div.innerHTML = robot.name + ": ";
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
        var robot = app.robots[r];
        if (robot.type != TYPE.RESOURCE)
            continue;

        var r_span = document.createElement("span");
        r_span.setAttribute("id","res-count-"+r);
        r_span.innerHTML = nf(robot.count);

        var acc_span = document.createElement("span");
        acc_span.setAttribute("id", "res-accrual-"+r);
        acc_span.innerHTML = nf(robot.stats.accrual_per_sec);

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","res-info-"+r);
        r_span2.setAttribute("class","info");

        var r_btn = document.createElement("div");
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("operation", "build");
        r_btn.setAttribute("id", "res-build-"+r);
        r_btn.innerHTML = "Gather";
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", robot.build_cost.length > 0);

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel res");
        
        r_div.innerHTML = robot.name + ": ";
        r_div.appendChild(r_span);
        r_div.innerHTML += " [";
        r_div.appendChild(acc_span);
        r_div.innerHTML += "/s]";
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_span2);
        r_div.appendChild(r_btn);

        res_container.appendChild(r_div);
    }
}

function buildGenerators(){
    var gen_container = document.getElementById('generator-container');

    var header = document.createElement("div");
    header.className = "header";
    header.id = "gen-header";
    header.innerHTML = "Generators"
    gen_container.appendChild(header);

    for (var r in app.robots) {
        var robot = app.robots[r];
        if (robot.type != TYPE.GENERATOR)
            continue;

        var r_span = document.createElement("span");
        r_span.setAttribute("id","gen-count-"+r);
        r_span.innerHTML = robot.count;

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","gen-info-"+r);
        r_span2.setAttribute("class","info");

        var r_btn = document.createElement("div");
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("operation", "gen-build");
        r_btn.setAttribute("id", "gen-build-"+r);
        r_btn.innerHTML = "Generate";
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", robot.build_cost.length > 0);

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel gen");
        
        r_div.innerHTML = robot.name + ": ";
        r_div.appendChild(r_span);
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_span2);
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_btn);

        gen_container.appendChild(r_div);
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


function updateUIResources() {
    document.getElementById("admin-container").innerHTML = "config: " + JSON.stringify( Config ) + "<BR>" +
        exportState();

}

function updateUIMachines() 
{
    for (var robotid in app.robots) {
        var robot = app.robots[robotid];

        if (robot.type != TYPE.MACHINE)
            continue;

        var y = "Produces ";
        robot.produces.forEach((x) => {
            y += "["+ nf(x.qty) + " " + x.id+"/s] ";
        });
        y = y.trim();
        
        document.getElementById("machine-info-"+robot.id).innerHTML = y;
        
        var unitCosts = { };
        robot.build_cost.forEach((x) => {
            unitCosts[x.id] = x.qty;
        });
        
        // update machine build buttons & titles
        var maxBuildable = robot.stats.max_buildable;
        var b = document.getElementById("machine-build-"+robot.id);
        b.title = "build 1 costs: " + pretty(unitCosts);
        b.setAttribute("button-disabled", maxBuildable.lt(1));

        document.getElementById("machine-build-half-count-"+robot.id).innerHTML=" ("+nf(maxBuildable.dividedBy(2).floor(), 0) + ")";
        b = document.getElementById("machine-build-half-"+robot.id);
        b.title = "build " + nf(maxBuildable.dividedBy(2).floor(), 0)+ " costs: " + pretty(mult(unitCosts, maxBuildable.dividedBy(2).floor()));
        b.setAttribute("button-disabled", maxBuildable.dividedBy(2).lt(1));

        document.getElementById("machine-build-max-count-"+robot.id).innerHTML=" ("+nf(maxBuildable.floor(), 0) + ")";
        b = document.getElementById("machine-build-max-"+robot.id);
        b.title = "build " + nf(maxBuildable.floor(), 0)+ " costs: " + pretty(mult(unitCosts, maxBuildable.floor()));
        b.setAttribute("button-disabled", maxBuildable.lt(1));

    }
    
}

function updateUIGenerators() 
{
    for (var robotid in app.robots) {
        var robot = app.robots[robotid];
        if (robot.type != TYPE.GENERATOR)
            continue;

        var y = "Generates ";
        robot.produces.forEach((x) => {
            y += "["+ nf(x.qty) + " " + x.id+"/s] ";
        });
        y = y.trim();
        
        //document.querySelector("#count-"+robot.id).innerHTML = nf(robot.count);
        document.getElementById("gen-info-"+robot.id).innerHTML = y;

        y = "";
        var enabled = true;
        robot.build_cost.forEach((x) => {
            y += "["+ nf(x.qty) + " " + app.robots[x.id].name +"] ";
            enabled = enabled && (x.qty.lte(app.robots[x.id].count));
        });
        y = y.trim();
    }
}

function updateControls() {
    document.getElementById("pause-button").innerHTML = app.paused ? 'Resume' : 'Pause';
}


function mult(json, z) {
    var y = {};
    for (var x in json) {
        y[x] = json[x].times(z);
    }
    return y;
}

function pretty(json) {
    var ret = "";
    for (var x in json) {
        ret += "[" + nf(json[x]) + " " + x + "] "
    }
    return ret.trim();
}

var verbs = [
    ['build','Builds'],
    ['generator', "Generates"],
    ['gather', 'Gathers']
];
var controlButtons = [
	['export','Export State','Export Game State'],
	['save-state','Save State','Save Game State to Local Storage'],
	['clear-state','Clear State','Game State from to Local Storage'],
    ['pause-button','Pause','Pause/Resume game ticker']
	/*["message_button","show","show message box"],
	
	["clear_button","clear","clear messages"],
	["export_button","export","export serialized game state to messages"],
	["load_button","load","load serialized game state from messages"],
	["export_json_button","JSON","show game state JSON"],
	["stats","stats","show game stats"],
	["config","config","config rbg parameters"],
	["reset_button","reset","reset game"],
	["hard_reset","hard","blow away local storage"]*/
];

