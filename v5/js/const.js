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

var machineParts = [
	'bit', 'part', 'piece', 'block', 'thing', 'object', 'widget',
	'device', 'gear', 'contraption', 'gimmick', 'dingbat','utensil',
	'gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob',
	'instrument', 'harness', 'kit', 'accessory', 'whatchamacalit', 'paraphernalia',
	'thingamajig','apparatus', 'appliance', 'furnishing', 'rig', 'rube goldberg'
];

// id, innerHTML, title
var optionsButtons = [
		["message_button","show","show message box"],
		["pause_button","pause","pause/resume game ticker"],
		["save_button","save","save game state"],
		["clear_button","clear","clear messages"],
		["export_button","export","export serialized game state to messages"],
		["load_button","load","load serialized game state from messages"],
		["export_json_button","JSON","show game state JSON"],
		["stats","stats","show game stats"],
		["config","config","config rbg parameters"],
		["reset_button","reset","reset game"],
		["hard_reset","hard","blow away local storage"]
	];