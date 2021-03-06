var Config = {
    numberformat: {
        format: 'standard',  // ['standard', 'hybrid', 'longScale', 'engineering']
        flavor: 'short', // ['full', 'short']
        sigfigs: 3,
        maxSmall: 0,
        backend: 'decimal.js'
    },
    ticks_per_second: 2,
};

var TYPE = { RESOURCE: 0, MACHINE: 1, GENERATOR: 2 };

var RES = { SPARK: { name: 'Spark', id: 'spark', code: 0},
            SCRAP: { name: 'Scrap', id: 'scrap', code: 1},
            MONEY: { name: 'Money', id: 'money', code: 2},
            PEOPLE: { name: 'People', id: 'people', code: 3},
            FUEL: { name: 'Fuel', id: 'fuel', code: 3}
           }; // RESOURCES

var formatter = new numberformat.Formatter(Config.numberformat);

function R(id, name, type, cost, prod)
{
    this.name = name;
    this.id = id;
    this.count = new Decimal(0);
    this.build_cost = Array.isArray(cost) ? cost : [cost];
    this.produces = Array.isArray(prod) ? prod : [prod];
    this.invisible = false;
    this.type = type;

    this.upgrades = {
        faster: { const: new Decimal(2), fcn: "upgrade_mult" },
        more: { const: new Decimal(1), fcn: "upgrade_add" }
    };
    this.stats = {
        build_clicks: new Decimal(0),
        total_built: new Decimal(0),
        accrual_per_sec: new Decimal(0),
        max_buildable: new Decimal(0),
        half_max_buildable: new Decimal(0),
    };
}

function cost(type, qty, mult, min = 0){
    return {id: type, qty: new Decimal(qty), mult: new Decimal(mult), min: new Decimal(min)};
}

function prod(type, qty, mult){
    return cost(type, qty, mult);
}

function App() {
    this.NAME = 'builder';
    this.paused = false;
    this.robots = {};
    this.last_tick = new Date().getTime();

    // resources
    this.robots[RES.SCRAP.id] = new R(RES.SCRAP.id, RES.SCRAP.name, TYPE.RESOURCE, [], []);
    this.robots[RES.SCRAP.id].count = new Decimal(35);
    
    this.robots[RES.SPARK.id] = new R(RES.SPARK.id, RES.SPARK.name, TYPE.RESOURCE, [], []);
    this.robots[RES.MONEY.id] = new R(RES.MONEY.id, RES.MONEY.name, TYPE.RESOURCE, [], []);
    this.robots[RES.FUEL.id] = new R(RES.FUEL.id, RES.FUEL.name, TYPE.RESOURCE, [], []);
    this.robots[RES.PEOPLE.id] = new R(RES.PEOPLE.id, RES.PEOPLE.name, TYPE.RESOURCE, [], []);

    // generators
    this.robots['nano'] = new R("nano", "Nanobot", TYPE.GENERATOR, [cost('robot0',10,10,11)], [prod(RES.SCRAP.id, 1, 1)/*, prod('robot0', 1, 1)*/]);
    this.robots['nano'].count = new Decimal(0);

    this.robots['grinder'] = new R("grinder", "Grinder", TYPE.GENERATOR, [cost('scrap',10000,100)], [prod(RES.SPARK.id, 1, 1)]);
    this.robots['grinder'].count = new Decimal(1);

    this.robots['vault'] = new R("vault", "Vault", TYPE.GENERATOR, [cost('robot0',100,100)], prod(RES.MONEY.id, 0.01, 1));
    this.robots['vault'].count = new Decimal(0);

    this.robots['refinery'] = new R("refinery", "Refinery", TYPE.GENERATOR, [cost('robot0',10000,1)], [prod(RES.FUEL.id, 1, 1)]);
    this.robots['refinery'].count = new Decimal(0);

    this.robots['gyro'] = new R("gyro", "Gyro", TYPE.GENERATOR, [cost('robot0',100000,1)], prod(RES.PEOPLE.id, 1, 1));
    this.robots['gyro'].count = new Decimal(0);

    // machines
    this.robots['robot0'] = new R("robot0", "Type E", TYPE.MACHINE, 
        [ cost(RES.SPARK.id, 1, 1), cost(RES.SCRAP.id, 10, 1) ],
        [ prod('nano', 1, 1) ]);

    this.robots['robot1'] = new R("robot1", "Type Z", TYPE.MACHINE, 
        [ cost(RES.SPARK.id, 1, 1), cost('robot0', 10, 1), cost(RES.SCRAP.id, 100, 1) ], 
        [ prod('robot0', 1, 1) ]);

    this.robots['robot2'] = new R("robot2", "Type Q", TYPE.MACHINE, 
        [ cost(RES.SPARK.id, 1, 1), cost('robot1', 100, 1), cost(RES.SCRAP.id, 100000, 1) ], 
        [ prod('robot1', 1, 1) ]);

    this.robots['robot3'] = new R("robot3", "Type R", TYPE.MACHINE, 
        [ cost(RES.SPARK.id, 1, 1), cost('robot2', 1000, 1), cost(RES.SCRAP.id, 1000000, 1) ], 
        [ prod('robot2', 1, 1) ]);

}

window.addEventListener('load', function() {
    function gameLoop() {
        var new_tick = new Date().getTime();
        if (!app.paused) {
            var ticks = Math.floor(Config.ticks_per_second * (new_tick - app.last_tick) / 1000 );
            
            if (ticks <= 1)
                tickCalc();
            else {
                console.log('calculating for', ticks, 'ticks.', );
                for (var i=0; i<ticks; i++)
                    tickCalc();
            }
            app.last_tick = new_tick;
        }

        

        updateUI();
        window.setTimeout(gameLoop, 1000 / Config.ticks_per_second);
    }

    // verify that the numbers are all Decimal objects
    checkAppNumbers(); 
    
    // build ui
    buildUI();
    // bind the model to the UI
    bindModel();

    // start game loop
    gameLoop();
});

var app = new App();

function nf(x, maxSmallOverride) {
    
    if (maxSmallOverride === undefined && x.lt(10)) {
        maxSmallOverride = 10;
    }

    return maxSmallOverride === undefined ? formatter.format(x) : formatter.format(x, { maxSmall: maxSmallOverride});
}

var robots_div = document.getElementById('robot-container');
var resources_div = document.getElementById('resource-container');
var generators_div = document.getElementById('generator-container');
var controls_div = document.getElementById('controls-container');

robots_div.addEventListener('click', function(evt){
    var op = evt.target.getAttribute("operation");
    var robotid = evt.target.getAttribute('robot');
    switch (op) {
        case "build":
            clickCalc(app.robots[robotid], "one");
            break;
        case "build-half":
            clickCalc(app.robots[robotid], "half");
            break;
        case "build-max":
            clickCalc(app.robots[robotid], "max");
            break;
        case "upgrade-faster":
            //app.robots[robotid].upgrades.faster = app.robots[robotid].upgrades.faster.plus(1);
            app.robots[robotid].produces.forEach((x)=> {

                console.log("calling", app.robots[robotid].upgrades.faster.fcn, "to increase production rate of", 
                    x.id, "from", x.qty.valueOf(), "/s to", 
                    upgrade_calc(app.robots[robotid].upgrades.faster.fcn, app.robots[robotid].upgrades.faster.const, x.qty).valueOf(), "/s");
                x.qty = upgrade_calc(app.robots[robotid].upgrades.faster.fcn, app.robots[robotid].upgrades.faster.const, x.qty);

            });

//            app.robots[robotid].produces[0].qty = upgradeCalc("myMult", app.robots[robotid].produces[0].qty, app.robots[robotid].upgrades.faster); 


  //          console.log("increasing",robotid,"production rate to",app.robots[robotid].produces.forEach((x)=>{console.log(x.id,x.qty.valueOf())}),"/s");
            
            break;
        case "upgrade-more":
            app.robots[robotid].produces.forEach((x)=> {

                console.log("calling", app.robots[robotid].upgrades.faster.fcn, "to increase production rate of", 
                    x.id, "from", x.qty.valueOf(), "/s to", 
                    upgrade_calc(app.robots[robotid].upgrades.faster.fcn, app.robots[robotid].upgrades.faster.const, x.qty).valueOf(), "/s");
                x.qty = upgrade_calc(app.robots[robotid].upgrades.faster.fcn, app.robots[robotid].upgrades.faster.const, x.qty);

            });

            console.log("each",robotid,"will make more");
            console.log(JSON.stringify(app.robots[robotid].build_cost))
            break;
        default:
            console.log("no handler for", evt.target.id);
    }
});

function upgrade_calc(op, d1, d2) {
    var fn = window[op];
    if(typeof fn === 'function') {
        return fn(d1, d2);
    }
}

function upgrade_add(d1,d2) {
    return d1.plus(d2);
}

function upgrade_mult(d1,d2) {
    return d1.times(d2);
}
resources_div.addEventListener('click', function(evt){
    var op = evt.target.getAttribute("operation");
    switch (op) {
        case "res-build":
            var robotid = evt.target.getAttribute("robot");
            clickCalc(app.robots[robotid]);
        break;
        default:
            console.log("no handler for", evt.target.id);
    }
});

generators_div.addEventListener('click', function(evt){
    var op = evt.target.getAttribute("operation");
    switch (op) {
        case "gen-build":
            var robotid = evt.target.getAttribute("robot");
            clickCalc(app.robots[robotid]);
        break;
        default:
            console.log("no handler for", evt.target.id);
    }
});

controls_div.addEventListener('click', function(evt){
    
    switch (evt.target.id) {
        case "export":
            exportState();
            // atob(encodedState);
            break;
        case 'pause-button':
            app.paused = !app.paused;
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
        
        // build and production
        [r.build_cost, r.produces].forEach((x) => {
            x.forEach((z) => {
                z.qty = decimalify(z.qty);
                z.mult = decimalify(z.mult);
            });
        });

        // stats
        for (var x in r.stats) {
            r.stats[x] = decimalify(r.stats[x]);
        }
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

function tickCalc(howManyTicks) {
    for (var rid in app.robots) {
        
        var r = app.robots[rid];
        r.produces.forEach((x) => {
            var built = app.robots[x.id];
            var inc = r.count.times(x.qty).dividedBy(Config.ticks_per_second);

            //if (x.id === 'money') console.log(x.id, "building:", inc.valueOf(), "mult:",x.mult.valueOf());

            if (inc.gt(0)) {
                built.count = built.count.plus(inc.times(x.mult));
                built.stats.total_built = built.stats.total_built.plus(inc);
            }
        });
    }

    updateStats();
}

function updateStats()
{
    // update accrual rates
    for (var rid in app.robots){
        app.robots[rid].stats.accrual_per_sec = new Decimal(0);
    }
    for (var rid in app.robots){
        var r = app.robots[rid];
        r.produces.forEach((x) => {
            app.robots[x.id].stats.accrual_per_sec = x.qty.times(r.count).plus(app.robots[x.id].stats.accrual_per_sec);
        });
    } 

    // update build costs
    for (var rid in app.robots) {
        var robot = app.robots[rid];
        var maxBuildable = null;
        var unitCosts = { };
        
        robot.build_cost.forEach((x) => {
            unitCosts[x.id] = x.qty;
            var z = app.robots[x.id].count.dividedBy(x.qty).floor();
            maxBuildable = maxBuildable === null ? z : Decimal.min(maxBuildable, z);
        });

        if (maxBuildable === null || isNaN(maxBuildable)) {
            robot.stats.max_buildable = 0;
            robot.stats.half_max_buildable = 0;
        } else {
            robot.stats.max_buildable = maxBuildable;
            robot.stats.half_max_buildable = maxBuildable.dividedBy(2).floor();
        }
    }
}


function calcHowMany(robot, howmany)
{
    var maxBuildable = null;

    var ignore = robot.build_cost.some((x) => {
        var consume = app.robots[x.id];

        var z = x.qty.eq(0) ? new Decimal(1) : consume.count.dividedBy(x.qty);
        maxBuildable = maxBuildable == null ? z : Decimal.min(maxBuildable, z);
        //console.log("building",nf(maxBuildable),robot.id, "from", nf(consume.count), consume.id, nf(x.qty), nf(z), "need min", x.min.valueOf(), x.id);

        if (maxBuildable.lt(1) || consume.count.lt(x.min)) {
            console.log("can't build", howmany, robot.id, "- costs", nf(x.qty), x.id, "with min", nf(x.min), x.id, "- have",nf(consume.count),x.id);
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
    updateStats();
    updateUI();
}


function updateUI()
{
    updateUIResources();
    updateUIGenerators();
    updateUIMachines();
    updateControls();
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

function Binding(b) {
    var _this = this;
    this.element = b.element;
    this.value = b.object[b.property];
    this.attribute = b.attribute;
    this.object = b.object;
    this.formatter = b.formatter;

    this.valueGetter = function(){
        return _this.value;
    }
    this.valueSetter = function(val){
        _this.value = val;
        _this.element[_this.attribute] = (_this.formatter === undefined)? val: _this.formatter(val);
    }

    Object.defineProperty(b.object, b.property, {
        get: this.valueGetter,
        set: this.valueSetter
    }); 
    
    this.toString = function() {
        return "element:" + _this.element.id;
    }
}

var bindings = [];

function bindModel()
{ 
    console.log("binding model to ui components");
    for (var r in app.robots)
    {
        if (app.robots[r].type === TYPE.RESOURCE) 
        {
            bindings.push( bind(app.robots[r], "count", document.getElementById("res-count-"+r), "innerHTML"));
            bindings.push( bind(app.robots[r].stats, "accrual_per_sec", document.getElementById("res-accrual-"+r), "innerHTML"));
        } 
        else if (app.robots[r].type === TYPE.GENERATOR) {
            bindings.push( bind(app.robots[r], "count", document.getElementById("gen-count-"+r), "innerHTML"));
        } else if( app.robots[r].type === TYPE.MACHINE) {
            bindings.push( bind(app.robots[r], "count", document.getElementById("machine-count-"+r), "innerHTML"));
        }
        else {
            console.log("unable to bind", r, "unknown type:", app.robots[r].type);
            continue;
        }
    }
}

function bind(robot, field, element, attribute, formatter = nf)
{
    //console.log("binding", robot.id, "to", element.id );
    return new Binding({
        object: robot,
        property: field,
        element:  element,
        attribute: attribute,
        formatter: nf
    });
}
