var Config = {
    numberformat: {
        format: 'standard',  // ['standard', 'hybrid', 'longScale', 'engineering']
        flavor: 'short', // ['full', 'short']
        sigfigs: 3,
        maxSmall: 100,
        backend: 'decimal.js'
    },
    ticks_per_second: 2,
};

var TYPE = { RESOURCE: 0, MACHINE: 1, GENERATOR: 2 };
var RESOURCES = ['solar', 'scrap', 'people', 'money'];


var RES = { SOLAR: { name: 'Solar', id: 'solar', code: 3},
            SCRAP: { name: 'Scrap', id: 'scrap', code: 0},
            MONEY: { name: 'Money', id: 'money', code: 2},
            PEOPLE: { name: 'People', id: 'people', code: 1} }; // RESOURCES

var formatter = new numberformat.Formatter(Config.numberformat);

function R(id, name, type, cost, prod)
{
    this.name = name;
    this.id = id;
    this.count = new Decimal(0);
    this.build_cost = Array.isArray(cost) ? cost : [cost];
    this.produces = Array.isArray(prod) ? prod : [prod];
    this.type = type;

    this.stats = {
        build_clicks: new Decimal(0),
        total_built: new Decimal(0),
        accrual_per_sec: new Decimal(0)
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

    this.robots[RES.SOLAR.id] = new R(RES.SOLAR.id, RES.SOLAR.name, TYPE.RESOURCE, [], []);
    this.robots[RES.SCRAP.id] = new R(RES.SCRAP.id, RES.SCRAP.name, TYPE.RESOURCE, [], []);
    
    this.robots[RES.MONEY.id] = new R(RES.MONEY.id, RES.MONEY.name, TYPE.RESOURCE, [], []);
    this.robots[RES.MONEY.id].count = 10;

    this.robots[RES.PEOPLE.id] = new R(RES.PEOPLE.id, RES.PEOPLE.name, TYPE.RESOURCE, cost(RES.PEOPLE.id, 0, 0), prod('gyro', 0.01, 1));
    
    this.robots['sun'] = new R("sun", "Sun", TYPE.GENERATOR, [], prod(RES.SOLAR.id, 1, 1));
    this.robots['sun'].count = new Decimal(1);

    this.robots['gyro'] = new R("gyro", "Gyro", TYPE.GENERATOR, [], prod(RES.SCRAP.id, 1, 1));
    this.robots['gyro'].count = new Decimal(1);

    this.robots['robot0'] = new R("robot0", "Type E", TYPE.MACHINE, 
        [ cost(RES.SCRAP.id, 1, 1), cost(RES.MONEY.id, 10, 1) ],
        [ prod(RES.MONEY.id, 1, 1) ]);

    this.robots['robot1'] = new R("robot1", "Type Z", TYPE.MACHINE, 
        [ cost('scrap', 1, 1), cost('robot0', 10, 1), cost('money', 100, 1) ], 
        [ prod('robot0', 1, 1) ]);

    this.robots['robot2'] = new R("robot2", "Type Q", TYPE.MACHINE, 
        [ cost('scrap', 1, 1), cost('robot1', 100, 1), cost('money', 100000, 1) ], 
        [ prod('robot1', 1, 1) ]);

    this.robots['robot3'] = new R("robot3", "Type R", TYPE.MACHINE, 
        [ cost('scrap', 1, 1), cost('robot2', 1000, 1), cost('money', 1000000, 1) ], 
        [ prod('robot2', 1, 1) ]);

}

window.addEventListener('load', function() {
    

    function gameLoop() {
        checkAppNumbers(); // might not need to do this every tick, just on game load.

        tickCalc();

        updateUI();

        window.setTimeout(gameLoop, 1000 / Config.ticks_per_second);
    }
    
    buildUI();
    gameLoop();
});

var app = new App();

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
            clickCalc(app.robots[robotid], "one");
            break;
        case "build-half":
            var robotid = evt.target.getAttribute('robot');
            clickCalc(app.robots[robotid], "half");
            break;
        case "build-max":
            var robotid = evt.target.getAttribute('robot');
            clickCalc(app.robots[robotid], "max");
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
        
        [r.build_cost, r.produces].forEach((x) => {
            x.forEach((z) => {
                z.qty = decimalify(z.qty);
                z.mult = decimalify(z.mult);
            });
        });
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
    for (var rid in app.robots) {
        
        var r = app.robots[rid];
        r.produces.forEach((x) => {
            var built = app.robots[x.id];
            var inc = r.count.times(x.qty).dividedBy(Config.ticks_per_second);

            if (inc.gt(0)) {
                built.count = built.count.plus(inc);
                built.stats.total_built = built.stats.total_built.plus(inc);
            }
        });   
        //r.stats.accrual_per_sec = new Decimal(0); 
    }

    // update accrual rates
    for (var rid in app.robots){
        var r = app.robots[rid];
        
        r.produces.forEach((x) => {
            app.robots[x.id].stats.accrual_per_sec = x.qty.times(r.count).dividedBy(Config.ticks_per_second);
        });
    }


}

function calcHowMany(robot, howmany)
{
    var maxBuildable = null;

    var ignore = robot.build_cost.some((x) => {
        var consume = app.robots[x.id];

        var z = x.qty.eq(0) ? new Decimal(1) : consume.count.dividedBy(x.qty);
        maxBuildable = maxBuildable == null ? z : Decimal.min(maxBuildable, z);
        //console.log("building",nf(maxBuildable),robot.id, "from", nf(consume.count), consume.id, nf(x.qty), nf(z));

        if (maxBuildable.lt(1)) {
            console.log("can't build", howmany, robot.id, "need", nf(x.qty), x.id, "have",nf(consume.count));
            return true; // bail out
        }
    });

    if (ignore)
        return new Decimal(0);

    maxBuildable = maxBuildable === null?new Decimal(0):maxBuildable;
    switch (howmany){
        case "max":
            return maxBuildable.floor();
        break;
        case "half":
            return maxBuildable.dividedBy(2).floor();
        break;
        default: // one
            return maxBuildable.gte(1)? new Decimal(1) : new Decimal(0);;
    }
}

function clickCalc(robot, howmany = "one") {

    var count = calcHowMany(robot, howmany);
    if (count.gte(1)) {
        console.log("building", howmany, "["+count+"]", robot.id);
        robot.build_cost.forEach((x) => {
            var consume = app.robots[x.id];
            consume.count = consume.count.minus(count.times(x.qty));
            x.qty = x.qty.times(x.mult).ceil();
        });

        robot.count = robot.count.plus(count);
        robot.stats.build_clicks = robot.stats.build_clicks.plus(count); 
        robot.stats.total_built = robot.stats.total_built.plus(count);
    }

    updateUI();
}


function updateUI()
{
    updateUIResources();
    updateUIGenerators();
    updateUIMachines();
}

function exportState() {
    var out = {};
    for (var robotid in app.robots) {
        var r = app.robots[robotid];
        out[robotid] = r.stats;
    }
    //console.log( "stats:", JSON.stringify( out ) );
    return "stats: " + JSON.stringify( out );
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