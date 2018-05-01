var greekKeys = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu"
				, "nu", "xi", "omicron", "pi", "rho", "sigmaf", "sigma", "tau", "upsilon", "phi", "chi;", "psi", "omega"];


var greek = {
	alpha: { html:"&alpha;", small:"α" },
	beta: { html:"&beta;", small:"β" },
	gamma: { html:"&gamma;", small:"γ" },
	delta: { html:"&delta;", small:"δ" },
	epsilon: { html:"&epsilon;", small:"ε" },
	zeta: { html:"&zeta;", small:"ζ" },
	eta: { html:"&eta;", small:"η" },
	theta: { html:"&theta;", small:"θ" },
	iota: { html:"&iota;", small:"ι" },
	kappa: { html:"&kappa;", small:"κ" },
	lambda: { html:"&lambda;", small:"λ" },
	mu: { html:"&mu;", small:"μ" },
	nu: { html:"&nu;", small:"ν" },
	xi: { html:"&xi;", small:"ξ" },
	omicron: { html:"&omicron;", small:"ο" },
	pi: { html:"&pi;", small:"π" },
	rho: { html:"&rho;", small:"ρ" },
	sigmaf: { html:"&sigmaf;", small:"ς" },
	sigma: { html:"&sigma;", small:"σ" },
	tau: { html:"&tau;", small:"τ" },
	upsilon: { html:"&upsilon;", small:"υ" },
	phi: { html:"&phi;", small:"φ" },
	chi: { html:"&chi;", small:"χ" },
	psi: { html:"&psi;", small:"ψ" },
	omega: { html:"&omega;", small:"ω" }
}

function PerpetualMotionMachine(id, items_arr) {
	this.id = id;
	this.name = greekKeys[this.id];
	this.items = items_arr;
	this.active = false;
	
	this.efficiency = 0.1;
	this.sentience = 0.0;
	this.perpetual = false;

	this.manual_click_bonus_tick_equivalent = 1; // manual clicks are equivalet to this many clock ticks, >= 1
	this.state = [];
	for (var i=0; i < this.items.length; i++) {
		this.state.push( {
			id: i,
			name: this.items[i],
			base: this.baseCalc(this.id, i),
			value: this.baseCalc(this.id, i),

			cost: {
				c0: this.baseCalc(this.id, i),
				c1: 1,
				c2: 0
			},
			test: 1234,
			upgrades : 1,
			multiplier : 10,
			count: 0,
			halflife: this.halfLifeCalc(this.id, i),
			
			auto_build: false,
			
			previous: (i>0) ? i-1 : null,
			next: (i < this.items.length-1) ? i+1 : null,
			active: i===0 ? true : false,
			
			stats: {
				manual_build_clicks: 0,
				upgrade_production: 0,
				upgrade_manual_build: 0,
				auto_build: 0
			}
		});		
	};
};
var GAME_BASE = 10;
var PMM_BASE = 1.3;
var ITEM_BASE = 1.4;
PerpetualMotionMachine.prototype.baseCalc = function(pmm, item) {
	//console.log("baseCalc for pmm", pmm, "item", item, 'is', (1+item) * Math.pow(10, pmm));
	//return (1+item) * Math.pow(10, 1+pmm);
	return Math.round( (1+pmm) * GAME_BASE * Math.pow(ITEM_BASE, item));
};

PerpetualMotionMachine.prototype.halfLifeCalc = function(pmm, item) {
	// inverse the base
	return Math.round( (1+pmm) * Math.pow(GAME_BASE,1) * Math.pow(ITEM_BASE, this.items.length-item-1));
};

PerpetualMotionMachine.prototype.display = function() {
	//"machine:"+this.NAME+" | 0 | 0/s | 0/s<sup>2</sup> | time:0s | perpetual:false | efficiency:0.0 | sentience:0"
	//console.log("app c-values=" + app.c0_value,app.c1_value,app.c2_value);
	return "machine:"+greek[this.name].small + " | perpetual:" + this.perpetual + " | efficiency:"+ this.efficiency*100+"% | sentience:" + this.sentience;
};

PerpetualMotionMachine.prototype.autoBuildLevel = function(i) {
	return this.state[i].base;
}

PerpetualMotionMachine.prototype.consume = function(i) 
{
	// nothing to do right now
}


PerpetualMotionMachine.prototype.build = function(i, ignore_eff){
	var item = this.state[i];

	if (item.prev ===null)
	{
		console.log(item.name, "increasing total value", item.count);
		this.value += item.count;
	}
	else
	{
		var prev = this.state[item.prev]
		prev.count += this.state[i].count;
		console.log(item.name, "building", prev.name, item.count, prev.count);
		//this.state[i].count += 1;
	}
}

PerpetualMotionMachine.prototype.manual_build = function(i, count){
	var item = this.state[i];
	//console.log(item.cost.c0, item.cost.c1, item.cost.c2);
	
	if (i == 0)
	{
		console.log("manual build", item.name, "costs", item.cost);
		if (app.c0_value>item.value)
		{
			++item.count;
			app.c0_value-=item.value;
		}
	}
}

PerpetualMotionMachine.prototype.tick_calc = function(){
	var x = this.state[0].count + app.c1_base_rate;
	//console.log("tick_calc", this.state[0].name, "produces", x, "c1 units");

}

function App(){
	this.NAME = "PMM";
	this.TICK_INTERVAL = 1000;
	this.UI_REFRESH_INTERVAL = 1000;
	this.SAVE_INTERVAL = 5000;
	this.c0_value=0;
	this.c1_value=5;
	this.c2_value=0;

	this.c0_base_rate=1.0;
	this.c1_base_rate=0.0;
	this.c2_base_rate=0;


	this.last_save = new Date().getTime();
	this.pmm_defs = [];
	
	this.pmm_defs.push(
		new PerpetualMotionMachine(0, ['bit', 'part', 'piece', 'block', 'thing', 'object', 'widget'])
	);
	this.pmm_defs.push(
		new PerpetualMotionMachine(1, ['device', 'gear', 'contraption', 'gimmick', 'dingbat','utensil'])
	);
	this.pmm_defs.push(
		new PerpetualMotionMachine(2, ['gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob'])
	);
	this.pmm_defs.push(
		new PerpetualMotionMachine(3, ['instrument', 'harness', 'kit', 'accessory', 'whatchamacalit', 'paraphernalia'])
	);
	this.pmm_defs.push(
		new PerpetualMotionMachine(4, ['thingamajig','apparatus', 'appliance', 'furnishing', 'rig', 'rube goldberg'])
	);
};

App.prototype.display = function() {
	return "c-values: c0:"+this.c0_value+" ["+this.c0_base_rate+"/s] c1:"+
	this.c1_value+" ["+this.c1_base_rate+"/s]" + " c2"+this.c2_value+" ["+this.c2_base_rate+"/s]";
}

App.prototype.update_c0 = function() {
	this.c0_value+=this.c0_base_rate;
}

var app = new App();

// override common/timer.js defaults with app specific.
TICK_INTERVAL = app.TICK_INTERVAL;
UI_REFRESH_INTERVAL = app.UI_REFRESH_INTERVAL;
SAVE_INTERVAL = app.SAVE_INTERVAL;