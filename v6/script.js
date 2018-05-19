var TICKS_PER_SECOND = 2;
var TYPE = { RESOURCE: 0, MACHINE: 1 };
var RES = { SCRAP: { name: 'Scrap', id: 'scrap', code: 0},
            PEOPLE: { name: 'People', id: 'people', code: 1},
            MONEY: { name: 'Money', id: 'money', code: 2} }; // RESOURCES

function R(id, name, type, cost, prod)
{
    this.name = name;
    this.id = id;
    this.count = new Decimal(0);
    this.build_cost = cost;
    this.produces = prod;
    this.type = type;

    this.stats = {
        build_clicks: new Decimal(0),
        total_built: new Decimal(0)
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

    this.robots[RES.SCRAP.id] = new R(RES.SCRAP.id, RES.SCRAP.name, TYPE.RESOURCE, cost(RES.SCRAP.id, 0, 0), prod(RES.SCRAP.id, 0, 0));
    this.robots[RES.PEOPLE.id] = new R(RES.PEOPLE.id, RES.PEOPLE.name, TYPE.RESOURCE, cost(RES.PEOPLE.id, 0, 0), prod(RES.PEOPLE.id, 0, 0));
    this.robots[RES.MONEY.id] = new R(RES.MONEY.id, RES.MONEY.name, TYPE.RESOURCE, cost(RES.MONEY.id, 0, 0), prod(RES.MONEY.id, 0, 0));

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
        checkAppNumbers(); // might not need to do this every tick, just on game load.

        tickCalc();

        updateUI();

        window.setTimeout(gameLoop, 1000 / TICKS_PER_SECOND);
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
    var op = evt.target.getAttribute("operation");
    switch (op) {
        case "build":
            var robotid = evt.target.getAttribute('robot');
            clickCalc(app.robots[robotid]);
            break;
        default:
            console.log("no handler for", evt.target.id);
    }
});


resources_div.addEventListener('click', function(evt){
    var op = evt.target.getAttribute("operation");
    switch (op) {
        case "build":
            var robotid = evt.target.getAttribute("robot");
            clickCalc(app.robots[robotid]);
        break;

    }
});

controls_div.addEventListener('click', function(evt){
    
    switch (evt.target.id) {
        case "export":
            exportState();
            // atob(encodedState);
            break;
        default:
            console.log("no handler for", evt.target.id);
    }
});

/* Verify that all the numbers in the app state are Decimal objects
*/
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
        console.log("invalid number. defaulting zero.", val, e);
        return new Decimal(0);
    }
}

function tickCalc() {
    var x = new Decimal(0);

    for (var rid in app.robots) {
        var builder = app.robots[rid];
        var built = app.robots[builder.produces.id];
        var inc = builder.count.times(builder.produces.qty).dividedBy(TICKS_PER_SECOND);
        built.count = built.count.plus(inc);
        built.stats.total_built = built.stats.total_built.plus(inc);
    }
}

function clickCalc(robot) {
    var consume = app.robots[robot.build_cost.id];

    if (consume.count.lt(robot.build_cost.qty)) {
        console.log("can't build", robot.id, nf(robot.build_cost.qty), "<",nf(consume.count),robot.build_cost.id);
        return;
    }

    robot.count = robot.count.plus(1);
    robot.stats.build_clicks = robot.stats.build_clicks.plus(1); 
    robot.stats.total_built = robot.stats.total_built.plus(1);
    consume.count = consume.count.minus(robot.build_cost.qty);
    robot.build_cost.qty = robot.build_cost.qty.times(robot.build_cost.mult).ceil();

    updateUI();
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
        accrualPerSec[robot.produces.id] = accrualPerSec[robot.produces.id].plus(robot.produces.qty.times(robot.count).dividedBy(TICKS_PER_SECOND));
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

        var enabled = !robot.build_cost.qty.gt(app.robots[robot.build_cost.id].count);
        if (enabled)
            buildBtn.innerHTML = "Build (" + nf(robot.build_cost.qty) + ")";
        else
            buildBtn.innerHTML = "Nope";
        buildBtn.title = "costs " + nf(robot.build_cost.qty) + " " + robot.build_cost.id;
        buildBtn.disabled = true;
    }

    // update resources header
    var header = "Resources [";
    var count = 0;
    for (var res in RES)
    {
        if (count++ > 0)
            header += ", ";

        var resID = RES[res].id;
        
        if (app.robots[resID] == null)
            continue; // no resource defined

        document.querySelector("#res-" + resID).innerHTML = nf(app.robots[resID].count);
        header += RES[res].name + ": " + nf(accrualPerSec[resID].times(TICKS_PER_SECOND))+"/s";
    }
    document.querySelector("#res-header").innerHTML = header + "]";
}

function exportState() {
    var out = {};
    for (var robotid in app.robots) {
        var r = app.robots[robotid];
        out[robotid] = r.stats;
    }
    console.log( "stats:", JSON.stringify( out ) );

    //console.log( "JSON:", JSON.stringify(app));
    //console.log( "encoded:", btoa( JSON.stringify(app) ));
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