var TICKS_PER_SECOND = 1;

function R(id, name, cost, prod)
{
    this.name = name;
    this.id = id;
    this.count = new Decimal(0);
    this.build_cost = cost;
    this.produces = prod;
}

function cost(type, qty, mult){
    return {id: type, qty: new Decimal(qty), mult: new Decimal(mult)};
}

function prod(type, qty, mult){
    return {id: type, qty: new Decimal(qty), mult: new Decimal(mult)};
}

function App() {
    this.NAME = 'builder';
    this.numScrap = new Decimal(0);
    this.robots = {};

    this.robots['robot0'] =new R("robot0", "Type E", cost('scrap', 10, 1.25), prod('scrap', 1, 1));
    this.robots['robot1'] = new R("robot1", "Type Z", cost('robot0', 25, 1.25), prod('scrap', 10, 1));
    this.robots['robot2'] = new R("robot2", "Type Q", cost('robot1', 120, 1.25), prod('scrap', 100, 1));
    this.robots['robot3'] = new R("robot3", "Type R", cost('robot2', 900, 1.25), prod('scrap', 1000, 1));

    this.calc = function() {

        for (var rid in this.robots)
        {
            var r = this.robots[rid];
            console.log("building 1", r.name, "costs", nf(r.build_cost.qty), r.build_cost.id,
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
            //console.log(app.robots[r]);
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
            /*<div class="panel robot">Robo1: <span id="count-robot1">0</span><br/>
                <span class="info">Gathers 10 Scrap / s</span><br />
                <button class="build" id="build-robot1" robot="robot1" >Build (250)</button>
            </div>*/
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

            //console.log(robotid, evt.target, evt.target.parentElement, robot);

            if (app.numScrap.lt(robot.cost)) {
                console.log("can't build", robot.robottype, nf(app.numScrap), "<",nf(robot.cost));
                return;
            }
            robot.count = robot.count.plus(1);
            app.numScrap = app.numScrap.minus(robot.cost);
            robot.cost = robot.cost.times(1.25).ceil();
            
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
            app.numScrap = app.numScrap.plus(1);
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
    app.numScrap = decimalify(app.numScrap);
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
       // var r = app.robots[rid];
        //x = x.plus( r.count.times( r.scrap ).dividedBy( TICKS_PER_SECOND ));
    }

    app.numScrap = app.numScrap.plus(x);
}

function clickCalc() {

}

function updateUI()
{
    var scrapPerSec = new Decimal(0);
    for (var robotid in app.robots) {
        var robot = app.robots[robotid];
        document.querySelector("#count-"+robotid).innerHTML = nf(robot.count);
        
        var y = new Decimal(0);
        document.querySelector("#gather-"+robotid).innerHTML = "Gathers " + nf(robot.produces.qty) 
            + "/s [Total: " + nf(y) + "/s]";

        document.querySelector("#build-"+robotid).value = "Build (" + nf(robot.build_cost.qty) + ")";
        document.querySelector("#build-"+robotid).disabled = robot.build_cost.qty.gt(app.numScrap);

        scrapPerSec = scrapPerSec.plus(y);
    }

    // update resources
    document.querySelector("#res-scrap").innerHTML = nf(app.numScrap);
    document.querySelector("#res-header").innerHTML = "Resources [" + nf(scrapPerSec.times(TICKS_PER_SECOND)) + "/s]";
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