var intToGreekLetter = ["&alpha;", "&beta;", "&gamma;", "&delta;", "&epsilon;", "&zeta;", "&eta;", "&theta;", "&iota;", "&kappa;", "&lambda;", "&mu;"
				, "&nu;", "&xi;", "&omicron;", "&pi;", "&rho;", "&sigmaf;", "&sigma;", "&tau;", "&upsilon;", "&phi;", "&chi;", "&psi;", "&omega;"];


function PerpetualMotionMachine(id, name, description, items_arr) {
	this.id = id;
	this.NAME = name;
	this.DESCRIPTION = description;
	this.items = items_arr;
	this.active = false;
	
	this.efficiency = 0.0;
	this.sentience = 0.0;
	this.perpetual = false;

	this.state = [];
	for (var i=0; i < this.items.length; i++) {
		this.state.push( {
			id: i,
			name: this.items[i],
			base: this.baseCalc(this.id, i),
			value: 10*(i+1),

			upgrades : 1,
			multiplier : 10,
			count: 0,
			halflife: this.halfLifeCalc(this.id, i),
			
			auto_build: false,
			
			previous: (i>0) ? i-1 : null,
			next: (i < this.items.length-1) ? i+1 : null,
			active: i===0 ? true : false,
			
			stats: {
				manual_build: 0,
				manual_upgrade: 0,
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
	return Math.round( (1+pmm) * GAME_BASE * Math.pow(ITEM_BASE, this.items.length-item-1));
};

PerpetualMotionMachine.prototype.display = function() {
	//"machine:"+this.NAME+" | 0 | 0/s | 0/s<sup>2</sup> | time:0s | perpetual:false | efficiency:0.0 | sentience:0"
	return "machine:"+this.NAME + " | perpetual:" + this.perpetual + " | efficiency:"+ this.efficiency+" | sentience:" + this.sentience;
};

PerpetualMotionMachine.prototype.autoBuildLevel = function(i) {
	return this.state[i].base;
}


function App(){
	this.NAME = "PMM";
	this.TICK_INTERVAL = 1000;
	this.UI_REFRESH_INTERVAL = 1000;
	this.SAVE_INTERVAL = 5000;

	this.last_save = new Date().getTime();
	this.pmm_defs = [];

	var i=0;
	this.pmm_defs.push(
		new PerpetualMotionMachine(i, intToGreekLetter[i], "", ['bit', 'part', 'piece', 'block', 'thing', 'object', 'widget'])
	);
	i++;
	this.pmm_defs.push(
		new PerpetualMotionMachine(i,intToGreekLetter[i], "", ['device', 'gear', 'contraption', 'gimmick', 'dingbat','utensil'])
	);
	i++;
	this.pmm_defs.push(
		new PerpetualMotionMachine(i,intToGreekLetter[i], "", ['gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob'])
	);
	i++;
	this.pmm_defs.push(
		new PerpetualMotionMachine(i,intToGreekLetter[i], "", ['instrument', 'harness', 'kit', 'accessory', 'whatchamacalit', 'paraphernalia'])
	);
	i++;
	this.pmm_defs.push(
		new PerpetualMotionMachine(i,intToGreekLetter[i], "", ['thingamajig','apparatus', 'appliance', 'furnishing', 'rig', 'rube goldberg'])
	);
};

var app = new App();

// override common/timer.js defaults with app specific.
TICK_INTERVAL = app.TICK_INTERVAL;
UI_REFRESH_INTERVAL = app.UI_REFRESH_INTERVAL;
SAVE_INTERVAL = app.SAVE_INTERVAL;