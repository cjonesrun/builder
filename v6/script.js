var TICKS_PER_SECOND = 1;
var TYPE = { RESOURCE: 0, MACHINE: 1 };
var RES = { SCRAP: { name: 'Scrap', id: 'scrap', code: 0} }; // RESOURCES

function R(id, name, type, cost, prod)
{
    this.name = name;
    this.id = id;
    this.count = new Decimal(0);
    this.build_cost = cost;
    this.produces = prod;
    this.type = type;

    this.stats = {
        build_clicks: 0
    };
}

function cost(type, qty, mult){
    return {id: type, qty: new Decimal(qty), mult: new Decimal(mult)};
}

function prod(type, qty, mult){
    return {id: type, qty: new Decimal(qty), mult: new Decimal(mult)};
}

function App() {
    this.NAME = 'builder';
    this.robots = {};

    this.robots['scrap'] = new R("scrap", RES.SCRAP.name, TYPE.RESOURCE, cost(RES.SCRAP.id, 0, 1), prod(RES.SCRAP.id, 0, 0));
    this.robots['robot0'] = new R("robot0", "Type E", TYPE.MACHINE, cost(RES.SCRAP.id, 10, 1.25), prod(RES.SCRAP.id, 1, 1));
    this.robots['robot1'] = new R("robot1", "Type Z", TYPE.MACHINE, cost('robot0', 25, 1.25), prod(RES.SCRAP.id, 10, 1));
    this.robots['robot2'] = new R("robot2", "Type Q", TYPE.MACHINE, cost('robot1', 120, 1.25), prod(RES.SCRAP.id, 100, 1));
    this.robots['robot3'] = new R("robot3", "Type R", TYPE.MACHINE, cost('robot2', 900, 1.25), prod(RES.SCRAP.id, 1000, 1));

    this.calc = function() {

        for (var rid in this.robots)
        {
            var r = this.robots[rid];
            console.log(r, "building 1", r.name, "costs", nf(r.build_cost.qty), r.build_cost.id,
                "- next will cost", nf(r.build_cost.qty.times(r.build_cost.mult)), r.build_cost.id);
            console.log("each",r.id, "produces", nf(r.produces.qty.times(r.produces.mult)), 
                r.produces.id, "/s" );
            console.log("have", nf(this.robots[r.build_cost.id].count), "available");
        }
    }
}

window.addEventListener('load', function() {
    

    function gameLoop() {
        checkAppNumbers();

        tickCalc();

        updateUI();

        window.setTimeout(gameLoop, 1000 / TICKS_PER_SECOND);
    }
    

    function buildUI() {

        var robots_container = document.getElementById('robot-container');

        for (var r in app.robots) {
            if (!isMachine(app.robots[r]))
                continue;

             /*<div class="panel robot">Robo1: <span id="count-robot1">0</span><br/>
                <span class="info">Gathers 10 Scrap / s</span><br />
                <button class="build" id="build-robot1" robot="robot1" >Build (250)</button>
            </div>*/

            var r_span = document.createElement("span");
            r_span.setAttribute("id","count-"+r);
            r_span.innerHTML = "0";

            var r_span2 = document.createElement("span");
            r_span2.setAttribute("id","gather-"+r);
            r_span2.setAttribute("class","info");
            r_span2.innerHTML = "Gathers " + app.robots[r].scrap + "/s";

            var r_btn = document.createElement("input");
            r_btn.type = "button";
            r_btn.setAttribute("class", "build");
            r_btn.setAttribute("id", "build-"+r);
            r_btn.value = "Build (" + app.robots[r].cost + ")";
            r_btn.setAttribute("robot", r);

            var r_div = document.createElement("div");
            r_div.setAttribute("class", "panel robot");
            
            r_div.innerHTML = app.robots[r].name + ": ";
            r_div.appendChild(r_span);
            r_div.appendChild(document.createElement("br"));
            r_div.appendChild(r_span2);
            r_div.appendChild(document.createElement("br"));
            
            r_div.appendChild(r_btn);

            robots_container.appendChild(r_div);
        }
    }

    buildUI();
    gameLoop();
});


var app = new App();

var NUMBERFORMAT = {
	format: 'standard',  // ['standard', 'hybrid', 'longScale']
	flavor: 'short', // ['full', 'short']
	sigfigs: 3
}

var formatter = new  numberformat.Formatter({ sigfigs: NUMBERFORMAT.sigfigs, 
	backend: 'decimal.js', format: NUMBERFORMAT.format, flavor: NUMBERFORMAT.flavor });

function nf(x) {
	return formatter.format(x);
    //return x;
}


var robots_div = document.getElementById('robot-container');
var resources_div = document.getElementById('resource-container');
var controls_div = document.getElementById('controls-container');

robots_div.addEventListener('click', function(evt){
    var cla = evt.target.className;
    switch (cla) {
        case "build":
            var robotid = evt.target.getAttribute('robot')
            var robot = app.robots[robotid];
            var consume = app.robots[robot.build_cost.id];
            //console.log(robotid, evt.target, evt.target.parentElement, robot);

            if (consume.count.lt(robot.build_cost.qty)) {
                console.log("can't build", robot.id, nf(robot.build_cost.qty), "<",nf(consume.count),robot.build_cost.id);
                return;
            }
            robot.count = robot.count.plus(1);

            consume.count = consume.count.minus(robot.build_cost.qty);
            robot.build_cost.qty = robot.build_cost.qty.times(robot.build_cost.mult).ceil();
            
            // update related UI
            updateUI();
            break;
        default:
            // do nothing
    }
});


resources_div.addEventListener('click', function(evt){
    
    switch (evt.target.id) {
        case "gather-scrap":
            app.robots['scrap'].count = app.robots['scrap'].count.plus(1);
            updateUI();
        break;

    }
});

controls_div.addEventListener('click', function(evt){
    
    switch (evt.target.id) {
        case "export-state":
            console.log( btoa( JSON.stringify(app) ));
            // atob(encodedState);
            break;
        case "save-state":
            //window.localStorage['builder'] =  btoa( JSON.stringify(app) );
            break;
        case "clear-state":
            // var state = JSON.parse( atob(encodedState) );
            break;
        default:
            console.log("no handler for", evt.target.id);
    }
});


function checkAppNumbers()
{
    for (var rid in app.robots) {
        var r = app.robots[rid];
        
        r.count = decimalify(r.count);
        r.build_cost.qty = decimalify(r.build_cost.qty);
        r.build_cost.mult = decimalify(r.build_cost.mult);

        r.produces.qty = decimalify(r.produces.qty);
        r.produces.mult = decimalify(r.produces.mult);
    }
}

function decimalify(val)
{
    if (val instanceof Decimal)
        return val;

    try
    {
        return new Decimal(val);
    }
    catch (e)
    {
        console.log("invalid number", val, e);
        return new Decimal(0);
    }
}

function tickCalc() {
    var x = new Decimal(0);

    for (var rid in app.robots) {
        var builder = app.robots[rid];
        var built = app.robots[builder.produces.id];

        built.count = built.count.plus(builder.count.times(builder.produces.qty)).dividedBy(TICKS_PER_SECOND);
       // var r = app.robots[rid];
        //x = x.plus( r.count.times( r.scrap ).dividedBy( TICKS_PER_SECOND ));
    }
}

function clickCalc() {

}

function updateUI()
{
    var accrualPerSec = {};
    for (var r in app.robots){
        var robot = app.robots[r];
        var r2 = app.robots[robot.produces.id];

        accrualPerSec[r] = new Decimal(0);

        var y = robot.count.times(robot.produces.qty);
        //console.log(robotid,"produces", nf(robot.produces.qty.times(robot.count)), robot.produces.id);
        accrualPerSec[robot.produces.id] = accrualPerSec[robot.produces.id].plus(robot.produces.qty.times(robot.count));
    }

    //Object.keys(accrualPerSec).forEach((y)=>{console.log(y, nf(accrualPerSec[y]));});

    for (var robotid in app.robots) {
        var robot = app.robots[robotid];
        var r2 = app.robots[robot.produces.id];
        
        if (!isMachine(robot)) 
            continue;

        var y = robot.count.times(robot.produces.qty);
        document.querySelector("#count-"+robotid).innerHTML = nf(robot.count);
        document.querySelector("#gather-"+robotid).innerHTML = "Gathers " + nf(robot.produces.qty) +" " +r2.name 
            + "/s [Total: " + nf(y) + "/s]";

        var buildBtn = document.querySelector("#build-"+robotid);
        buildBtn.value = "Build (" + nf(robot.build_cost.qty) + ")";
        buildBtn.title = "costs " + nf(robot.build_cost.qty) + " " + robot.build_cost.id;
        buildBtn.disabled = robot.build_cost.qty.gt(app.robots[robot.build_cost.id].count);
    }

    // update resources header
    var header = "Resources [";
    for (var res in RES)
    {
        var resID = RES[res].id;
        document.querySelector("#res-" + resID).innerHTML = nf(app.robots[resID].count);
        header += RES[res].name + ": " + nf(accrualPerSec[resID].times(TICKS_PER_SECOND));
    }
    document.querySelector("#res-header").innerHTML = header + "/s]";
}

function load(encodedState) {
    var state;
    try {
        var state = JSON.parse( atob(encodedState) );
    } catch (e) {
        console.log("error parsing encoded state", e);
        state = new App();
    }
    app = state;

    checkAppNumbers();

    updateUI();
}

function isMachine(r)
{
    return r.type == TYPE.MACHINE;
}