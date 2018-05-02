function autoBuild(pmm, item, enabled){
	//console.log("auto build", pmm, item, enabled);
	app.pmm_defs[pmm].state[item].auto_build = enabled;
}

function updateUI(){
	header_div.innerHTML = app.display();

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
	row.querySelector(".pmm-item-name").title =  itemTitle(pmm_id, item);
	row.querySelector(".pmm-item-count").innerHTML = numberFormat( item.count );
	row.querySelector(".pmm-item-auto-build[type='checkbox']").checked = item.auto_build;

}

function itemTitle(pmm_id, item) {
	var str = "build 1 " + item.name + " for: ";
	var c = []
	if (item.cost.c0 >0)
		c.push(item.cost.c0 + " c0");
	if (item.cost.c1 >0)
		c.push(item.cost.c1 + " c1");
	if (item.cost.c2 >0)
		c.push(item.cost.c2 + " c2");
	if (item.cost.item != null)
	{
		var cost = app.pmm_defs[pmm_id].state[item.cost.item.id];
		c.push(item.cost.item.count + " " + cost.name);
	}

	str += c.join(" and ");

	str += ". each " + item.name+ " produces: ";
	var d = []
	if (item.production.c0 >0)
		d.push(item.production.c0 + " c0");
	if (item.production.c1 >0)
		d.push(item.production.c1 + " c1");
	if (item.production.c2 >0)
		d.push(item.production.c2 + " c2");
	if (item.production.item != null)
	{
		var prod = app.pmm_defs[pmm_id].state[item.production.item.id];
		d.push("1 " + prod.name);
	}
	str += d.join(" and ");
	return str.trim();
}

function getPMMContainer(pmm){
	return machines_div.querySelector(".pmm-container[data-pmm='"+pmm+"']")
}

function getItemDiv(pmm, item){
	return machines_div.querySelector(".pmm-item-row[data-pmm='"+pmm+"'][data-pmm-item='"+item+"']");
}

function build(pmm_index,item_index,count)
{
	app.pmm_defs[pmm_index].manual_build(item_index, count);
}

var min_val = Number.MAX_VALUE;
var last_total = 0;
function calculate() 
{

	app.update_app();

	var total_val = 0;

	for (var i=0; i<app.pmm_defs.length; i++) {
		var machine = app.pmm_defs[i];

		machine.tick_calc();
		if ( !app.pmm_defs[i].active ) {
			break;
		}

		for (var j=0; j<app.pmm_defs[i].state.length; j++) {

			var item = machine.state[j];

			if ( item.auto_build ) {
				var next = machine.state[item.next]
				if (!next.active) {
					next.active = true;
					next.count = 0;
				}
				//next.count += machine.exp_decay(item.id);
				machine.consume(item.id);
				machine.build(next.id);
            }

			total_val += item.count * item.value;
		}
		// item at this point is that last one for the machine
		if (item.count > stop){
			if (item.auto_build) {
				//machine.state[0].count += machine.exp_decay(item.id);
				machine.consume(item.id);
				machine.build(machine.state[0].id);
			}
		} 
	}
	last_total = total_val;
	if (total_val < min_val){
		addMessage(prettyDate(new Date())+":", "min val:", total_val);
		min_val = total_val;
	}
}

function calcVal(){
	var tot = 0;
	for (var i=0; i<app.pmm_defs.length; i++) {
		var machine = app.pmm_defs[i];
		if ( !machine.active ) {
			break;
		}

		for (var j=0; j<machine.state.length; j++) {
			var item = machine.state[j];
			if (!item.active){
				break;
			}
			tot += item.count*item.base;
		}
	}
	return tot;
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

function handlePerpetualMotion(machine_id, enabled){
	var machine = app.pmm_defs[machine_id];
	//console.log(machine.name, "setting perpetual motion to", enabled?"enabled":"disabled");
	machine.perpetual = enabled;
}

function enablePMM(machine){
	
	var container = getPMMContainer(machine.id);
	var item = machine.state[machine.items.length-1];

	if (container.querySelector(".pmm-enable-pm") === null) {
		var d_check = div(null, "pmm-enable-pm", null, null, {"data-pmm":machine.id, "data-pmm-item":item.id});
			d_check.appendChild( check("pmm-enable-pm"+machine.id, "pmm-enable-pm", "ENABLEPMM", 
				"click to enable perpetual motion for "+machine.name, {"data-pmm":machine.id, "data-pmm-item":item.id}) );

		var item_div = getItemDiv(machine.id, machine.items.length-1);
		item_div.appendChild(d_check);
		//console.log(machine.name, 'is perpetual motion ready! enable it now.', item_div);
	}
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