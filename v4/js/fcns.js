function autoBuild(pmm, item, enabled){
	console.log("auto build", pmm, item, enabled);
}

function build(pmm, item, howmany){
	//console.log( "build", pmm, item, howmany, app.pmm_defs[pmm].state[item]);
	app.pmm_defs[pmm].state[item].count+=howmany;
	updateItem(pmm, item);
}

function updateUI(){
	for (var i=0; i<app.pmm_defs.length; i++) {
		//console.log(i);
		for (var j=0; j<app.pmm_defs[i].state.length; j++) {
			//console.log('updating', app.pmm_defs[i].NAME, app.pmm_defs[i].state[j].name);
			machines_div.querySelector(".pmm-item-count[data-pmm='"+i+"'][data-pmm-item='"+j+"']").innerHTML = app.pmm_defs[i].state[j].count;
		}
	}
}

function updateItem(pmm, item){
	/*var machine = machines_div.querySelector("[data-pmm='"+pmm+"']");
	console.log(machine);*/
	var row = machines_div.querySelector(".pmm-item-row[data-pmm='"+pmm+"'][data-pmm-item='"+item+"']");
	row.querySelector(".pmm-item-count").innerHTML = app.pmm_defs[pmm].state[item].count;

}

function getItemDiv(pmm, item){
	
}

function calculate() {
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
	app.last_save = new Date().getTime();
	//saveObj("PMM", app);
}