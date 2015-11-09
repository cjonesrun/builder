var PerpetualMotionModule = function () {

	var NAME = "perpetualmotion";
	var DESCRIPTION = "perpetual motion machines are impossible!";
	var VERSION = 0.3;

	var effeciency = 0;
	var sentience = 0;

	// expose 'public' methods and vars here. nb. only the vars made public will be serialized to json
	return {
		// "constants"
		NAME: NAME,
		DESCRIPTION: DESCRIPTION,
		VERSION: VERSION,

		// public variables
		effeciency: effeciency,
		sentience: sentience,
	};

}; // END game Module