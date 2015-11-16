function autoBuild(pmm, item, enabled){
	//console.log("auto build", pmm, item, enabled);
	app.pmm_defs[pmm].state[item].auto_build = enabled;
}

function build(pmm, item, howmany){
	//console.log( "build", pmm, item, howmany, app.pmm_defs[pmm].state[item]);
	app.pmm_defs[pmm].state[item].count+=howmany;
	updateItem(pmm, item);
}

function updateUI(){
	for (var i=0; i<app.pmm_defs.length; i++) {
		//console.log(app.pmm_defs[i].NAME, app.pmm_defs[i].active);

		var machine = getPMMContainer(i);
		setVisible(machine, app.pmm_defs[i].active);

		if (!app.pmm_defs[i].active)
			break;

		machine.querySelector(".pmm-title").innerHTML = app.pmm_defs[i].display();
		setVisible( machine, app.pmm_defs[i].active );
		for (var j=0; j<app.pmm_defs[i].state.length; j++) {
			//if (j===0 && i===0) console.log('updating', app.pmm_defs[i].NAME, app.pmm_defs[i].state[j].name, app.pmm_defs[i].state[j].count);
			//machines_div.querySelector(".pmm-item-count[data-pmm='"+i+"'][data-pmm-item='"+j+"']").innerHTML = app.pmm_defs[i].state[j].count;
			updateItem(i,j);
		}
	}
}

function updateItem(pmm, item_id){
	/*var machine = machines_div.querySelector("[data-pmm='"+pmm+"']");
	console.log(machine);*/
	var item = app.pmm_defs[pmm].state[item_id];
	var row = getItemDiv(pmm, item_id);
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
					next.active = true;

					// N1=N0*Math.exp(-1*Math.log(2)/75)
					// N1=N0* (1/2)^(t/halflife)
					var hl =  Math.pow(0.5, 1 / (item.halflife));
		            item.count = item.count * hl;

	            	//next.count += 1;
	            	if (next.count === 0) 
	            		next.count = 1; // first one is free
	            	next.count *= 1+(1-hl);
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
	
	if (isVisible(content)){
		setVisible(content, false);
		clicked.parentNode.setAttribute("data-pmm-active","false");
		return;
	}

	var allcontent = machines_div.querySelectorAll(".pmm-content");
	for (var i=0; i<allcontent.length; i++){
		setVisible(allcontent[i], false);
		allcontent[i].parentNode.setAttribute("data-pmm-active","false");
	}
	
	var content = clicked.parentNode.querySelector(".pmm-content");
	setVisible(content, !isVisible(content))
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