
var GAME_BASE = 10;
var PMM_BASE = 1.3;
var ITEM_BASE = 1.4;

var MATH_MODE = {
	LINEAR : {value: 0, name: "Linear", value: 5}, 
	EXPONENTIAL : {value: 1, name: "Exponential", value: 1.05}, 
 	LOGARITHMIC : {value: 2, name: "Logarithmic", value: 2.71}
};

// Main App
function App(){
	// constants
	this.NAME = "RGM";
	this.TICK_INTERVAL = 1000;
	this.UI_REFRESH_INTERVAL = 1000;
	this.SAVE_INTERVAL = 5000;

	this.MATH = MATH_MODE.LINEAR;

	this.last_save = new Date().getTime();
	this.pmm_defs = [];
	
	this.pmm_defs.push(
		new PerpetualMotionMachine(0, machineParts.splice(0,6))
	);
}

// Perpetural Motion Machine
function PerpetualMotionMachine(id, items_arr) {

}