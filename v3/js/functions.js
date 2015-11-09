function updateUI() {

}

function calculate() {

}

function hardReset() {
	clearState(game.NAME, pmm.NAME);
}

function reset() {
    // stop timers.
    //stopTimers();

    game = new BuilderModule();
    pmm = new PerpetualMotionModule();
    
    saveState();

    builderInit();
    setMessage( ['game reset.'] );
}

function saveState(){
	saveObj(game.NAME, game);
	saveObj(pmm.NAME, pmm);
}

function showGameStats(){
	clearMessages();

	var finalDump = "generate system stats here...";
	/*for (var i=0; i<game.num_items(); i++){
		if (!game.map[i].active)
			continue;
		//console.log(game.map[i].stats)
		var stats = game.map[i].stats;
		finalDump += game.map[i].name + " " + JSON.stringify(stats, null, "\t")+"\n";
	}*/
	// bypass the MESSAGE_WINDOW_LINES limit for this
	setMessage(finalDump);
}
