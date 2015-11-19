function autoBuild(pmm, item, enabled){
	//console.log("auto build", pmm, item, enabled);
	app.pmm_defs[pmm].state[item].auto_build = enabled;
}

function build(pmm_id, item_id, howmany){
	var pmm = app.pmm_defs[pmm_id];
	var item = pmm.state[item_id];
	var prev = pmm.state[item.previous];
	//console.log( "build", pmm.name, item.name, howmany, item.count, pmm.decay(item_id));

	for (var i=0;i<howmany;i++){
		if (item.count === 0) { // first unit free
			//if (item.previous === null || prev.count >= prev.base)
			if (item.previous === null || prev.count >= 1)
				item.count = 1;
		} else if (item.previous === null){
			//var decay = pmm.decay(item_id);
			for (var j=0; j<pmm.manual_click_bonus_multiplier; j++) {
				console.log(j, item.name, 'grew', pmm.exp_grow(item.id, true));
			}
			//item.count /= pmm.decay(item_id);
			//item.count ++;
		} else {
			var prev = pmm.state[item.previous];

			//if (prev.count >= prev.base){
			if (prev.count >= 1){
				for (var j=0; j<pmm.manual_click_bonus_multiplier; j++){
					console.log(j, prev.name, 'decayed', pmm.exp_decay(prev.id));
					console.log(j, item.name, 'grew', pmm.exp_grow(item.id, true));
				}
			}
			updateItem(pmm_id, prev.id);
		}
		updateItem(pmm_id, item_id);
	}

}

function updateUI(){
	for (var i=0; i<app.pmm_defs.length; i++) {
		//console.log(app.pmm_defs[i].NAME, app.pmm_defs[i].active);

		var machine = getPMMContainer(i);
		setVisible(machine, app.pmm_defs[i].active);

		if (!app.pmm_defs[i].active)
			break;

		machine.querySelector(".pmm-title").innerHTML = app.pmm_defs[i].display();
		machine.querySelector(".pmm-title").title = app.pmm_defs[i].display();
		setVisible( machine, app.pmm_defs[i].active );
		for (var j=0; j<app.pmm_defs[i].state.length; j++) {
			//if (j===0 && i===0) console.log('updating', app.pmm_defs[i].NAME, app.pmm_defs[i].state[j].name, app.pmm_defs[i].state[j].count);
			//machines_div.querySelector(".pmm-item-count[data-pmm='"+i+"'][data-pmm-item='"+j+"']").innerHTML = app.pmm_defs[i].state[j].count;
			updateItem(i,j);
		}
	}
}

function updateItem(pmm_id, item_id){
	/*var machine = machines_div.querySelector("[data-pmm='"+pmm+"']");
	console.log(machine);*/
	var item = app.pmm_defs[pmm_id].state[item_id];
	var row = getItemDiv(pmm_id, item_id);
	row.querySelector(".pmm-item-name").innerHTML = item.name + " [" + item.base + "]";
	row.querySelector(".pmm-item-name").title = "" + item.name + " | " + item.base + " | " + item.halflife;
	row.querySelector(".pmm-item-count").innerHTML = numberFormat( item.count );
	row.querySelector(".pmm-item-auto-build[type='checkbox']").checked = item.auto_build;

}

function getPMMContainer(pmm){
	return machines_div.querySelector(".pmm-container[data-pmm='"+pmm+"']")
}

function getItemDiv(pmm, item){
	return machines_div.querySelector(".pmm-item-row[data-pmm='"+pmm+"'][data-pmm-item='"+item+"']");
}

function calculate() {
	for (var i=0; i<app.pmm_defs.length; i++) {
		var machine = app.pmm_defs[i];
		if ( !app.pmm_defs[i].active ) {
			break;
		}

		for (var j=0; j<app.pmm_defs[i].state.length; j++) {

			var item = machine.state[j];

			if (item.count >= item.base && item.next !== null){
				if (item.auto_build ) {
					var next = machine.state[item.next]
					if (!next.active) {
						next.active = true;
						next.count = 1;
					}
					machine.exp_decay(item.id);
					machine.exp_grow(next.id);
	            }
			}
			/*if( item.active )
				console.log('updating', machine.NAME, 'item', item.name, item.count);*/
		}
	}
}

function toggleContentVis(el){
	// if the visible one was clicked, toggle visibility
	var clicked = el;
	var content = clicked.parentNode.querySelector(".pmm-content");
	setVisible(content, true);
	if (isVisible(content)){
		//setVisible(content, false);
		clicked.parentNode.setAttribute("data-pmm-active","false");
		return;
	}

	var allcontent = machines_div.querySelectorAll(".pmm-content");
	for (var i=0; i<allcontent.length; i++){
		//setVisible(allcontent[i], false);
		allcontent[i].parentNode.setAttribute("data-pmm-active","false");
	}
	
	var content = clicked.parentNode.querySelector(".pmm-content");
	//setVisible(content, !isVisible(content))
	clicked.parentNode.setAttribute("data-pmm-active",""+isVisible(content));
}

function saveState(){
	//console.log('saving');
	app.last_save = new Date().getTime();
	saveObj(app.NAME, app);
}

function hardReset() {
	clearState(app.NAME);
}

function showGameStats(){
	clearMessages();

	var finalDump = "";
	for (var i=0; i<app.pmm_defs.length; i++){
		if (!app.pmm_defs[i].active)
			continue;
		
		var machine = app.pmm_defs[i];
		for (var j=0; j<machine.items.length; j++){
			if (!machine.state[j].active){
				break;
			}
			var stats = machine.state[j].stats;
			finalDump += machine.display() +"\n"+machine.state[j].name + " " + JSON.stringify(stats, null, "\t")+"\n";
		}
	}


	// bypass the MESSAGE_WINDOW_LINES limit for this
	setMessage( finalDump );
}