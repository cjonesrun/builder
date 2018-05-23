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
        r_span.setAttribute("id","count-"+r);
        r_span.innerHTML = "0";

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","gather-"+r);
        r_span2.setAttribute("class","info");

        var r_btn = document.createElement("div");
        r_btn.setAttribute("operation", "build");
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("id", "build-"+r);
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", robot.build_cost.length > 0);
        r_btn.innerHTML = "Build";

        var r_btn2 = document.createElement("div");
        r_btn2.setAttribute("operation", "build-max");
        r_btn2.setAttribute("class", "button panel");
        r_btn2.setAttribute("id", "build-max-"+r);
        r_btn2.setAttribute("robot", r);
        r_btn2.setAttribute("data-visible", robot.build_cost.length > 0);
        r_btn2.innerHTML = "Build Max";

        var r_btn3 = document.createElement("div");
        r_btn3.setAttribute("operation", "build-half");
        r_btn3.setAttribute("class", "button panel");
        r_btn3.setAttribute("id", "build-half-"+r);
        r_btn3.setAttribute("robot", r);
        r_btn3.setAttribute("data-visible", robot.build_cost.length > 0);
        r_btn3.innerHTML = "Build Half";

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
        r_span.setAttribute("id","res-"+r);
        r_span.innerHTML = "0";

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","produces-"+r);
        r_span2.setAttribute("class","info");

        var r_btn = document.createElement("div");
        //r_btn.type = "button";
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("operation", "build");
        r_btn.setAttribute("id", "gather-"+r);
        r_btn.innerHTML = "Gather";
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", robot.build_cost.length > 0);

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel res");
        
        r_div.innerHTML = robot.name + ": ";
        r_div.appendChild(r_span);
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
        r_span.setAttribute("id","count-"+r);
        r_span.innerHTML = "0";

        var r_span2 = document.createElement("span");
        r_span2.setAttribute("id","generate-"+r);
        r_span2.setAttribute("class","info");

        /*var r_btn = document.createElement("div");
        //r_btn.type = "button";
        r_btn.setAttribute("class", "button panel");
        r_btn.setAttribute("operation", "generate");
        r_btn.setAttribute("id", "generate-"+r);
        //r_btn.value = "Gather";
        r_btn.innerHTML = "Generate";
        r_btn.setAttribute("robot", r);
        r_btn.setAttribute("data-visible", robot.build_cost.length > 0);*/

        var r_div = document.createElement("div");
        r_div.setAttribute("class", "panel gen");
        
        r_div.innerHTML = robot.name + ": ";
        r_div.appendChild(r_span);
        r_div.appendChild(document.createElement("br"));
        r_div.appendChild(r_span2);

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
    var count = 0;
    var header = "Resources [";
    for (var robotid in app.robots) {
        var robot = app.robots[robotid];
        if (robot.type != TYPE.RESOURCE)
            continue;

        if (count++ > 0)
            header += ", ";

        var y = robot.produces.length > 0 ? "Produces " : "";
        robot.produces.forEach((x) => {
            y += "["+ nf(x.qty, 100) + " " + x.id+"/s] ";
        });
        y = y.trim();

        document.querySelector("#produces-" + robotid).innerHTML = y;
        document.querySelector("#res-" + robotid).innerHTML = nf(robot.count);
        header += robot.name + ": " + nf(robot.stats.accrual_per_sec.times(Config.ticks_per_second))+"/s";
    }

    document.querySelector("#res-header").innerHTML = header + "]";

    document.querySelector("#admin-container").innerHTML = "config: " + JSON.stringify( Config ) + "<BR>" +
        exportState();

}

function updateUIMachines() 
{
    for (var robotid in app.robots) {
        var robot = app.robots[robotid];

        if (robot.type != TYPE.MACHINE)
            continue;

        var y = "Gathers ";
        robot.produces.forEach((x) => {
            y += "["+ nf(x.qty) + " " + x.id+"/s] ";
        });
        y = y.trim();
        
        document.querySelector("#count-"+robot.id).innerHTML = nf(robot.count);
        document.querySelector("#gather-"+robot.id).innerHTML = y;

        var maxBuildable = null;
        var unitCosts = { };
        robot.build_cost.forEach((x) => {
            unitCosts[x.id] = x.qty;
            var z = app.robots[x.id].count.dividedBy(x.qty).floor();
            maxBuildable = maxBuildable === null ? z : Decimal.min(maxBuildable, z);
        });
        
        // update machine build button titles
        document.querySelector("#build-"+robot.id).title = "build 1 costs: " + pretty(unitCosts);
        document.querySelector("#build-"+robot.id).setAttribute("button-disabled", maxBuildable.lt(1));

        document.querySelector("#build-half-"+robot.id).innerHTML = "Build Half ("+nf(maxBuildable.dividedBy(2).floor(), 0) + ")"
        document.querySelector("#build-half-"+robot.id).title = "build " + nf(maxBuildable.dividedBy(2).floor(), 0)+ " costs: " + pretty(mult(unitCosts, maxBuildable.dividedBy(2).floor()));
        document.querySelector("#build-half-"+robot.id).setAttribute("button-disabled", maxBuildable.dividedBy(2).lt(1));

        document.querySelector("#build-max-"+robot.id).innerHTML = "Build Max ("+nf(maxBuildable.floor(), 0) + ")";
        document.querySelector("#build-max-"+robot.id).title = "build " + nf(maxBuildable.floor(), 0)+ " costs: " + pretty(mult(unitCosts, maxBuildable.floor()));
        document.querySelector("#build-max-"+robot.id).setAttribute("button-disabled", maxBuildable.lt(1));
        /*[document.querySelector("#build-"+robot.id), document.querySelector("#build-maxall-"+robot.id), document.querySelector("#build-half-"+robot.id)]
            .forEach((x) => {
                x.title = "costs " + y;
                x.setAttribute("button-disabled", !enabled); 
            });*/
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
        
        document.querySelector("#count-"+robot.id).innerHTML = nf(robot.count);
        document.querySelector("#generate-"+robot.id).innerHTML = y;

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
    document.querySelector("#pause-button").innerHTML = app.paused ? 'Resume' : 'Pause';
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

function bindModelInput(obj, property, domElem, domElementProp) {
  Object.defineProperty(obj, property, {
    get: function() { return domElem.value; }, 
    set: function(newValue) { domElem[domElementProp] = nf(newValue); },
    configurable: true
  });
}

user = {}
bindModelInput(user,'name',document.getElementById('foo'), "innerHTML");
