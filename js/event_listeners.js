var mainTable = getElement('main_table');
var messagesTable = getElement('messages_table');
var tabBarDiv = getElement("tab_bar_div");
var slider = getElement("tick_rate_slider");

slider.addEventListener('change', function(e){
	console.log(e, e.target.value);

});

tabBarDiv.addEventListener('click', function(e){
	its.clearAll();
	
	if (e.target.id === tabBarDiv.id)
		return;

	//console.log("click on", e.target.id, e.target.getAttribute("pmm-index"));

	var pmm_index = e.target.getAttribute("pmm-index");
	game.pmm.state[pmm_index]++;
	
	e.target.textContent = "PMM" + pmm_index + ": " + game.pmm.state[pmm_index];
});

// main_table event listener
mainTable.addEventListener('click', function(e){
	its.clearAll();

	if (e.target.nodeName === 'DIV'){
		var btnClass = e.target.className;
		var row = closestParentByClass(e.target, 'item-data-row');
	  	var item_id = parseInt(row.getAttribute('item-id'));

	  	if (hasClass(e.target, "build_single"))
	  		build(item_id, 0);
	  	else if (hasClass(e.target, "build_half"))
	  		build(item_id, 0.5);
	  	else if (hasClass(e.target, "build_all"))
	  		build(item_id, 1);
	  	else if (hasClass(e.target, "pull_down"))
	  		buildDown(0, item_id);
	  	else if (hasClass(e.target, "push_down"))
	  		buildDown(item_id, game.num_items()-1);
	  	else if (hasClass(e.target, "rate_build_single"))
	  		buildRateInc(item_id, 0);
	  	else if (hasClass(e.target, "rate_build_half"))	 
	  		buildRateInc(item_id, 0.5); 		
	  	else if (hasClass(e.target, "rate_build_all"))
	  		buildRateInc(item_id, 1);
	  	else if (hasClass(e.target, "pull_up"))
	  		buildUp(game.num_items()-1,item_id);
	  	else if (hasClass(e.target, "push_up"))
	  		buildUp(item_id, 0);
	  	/*else
	  		its.a('main_table event handle. no button handler for ' + btnClass);*/
  	}

	if (e.target.nodeName === 'TEXT'){
		var row = closestParentByClass(e.target, 'item-data-row');
	    var item_id = parseInt(row.getAttribute('item-id'));
	  	var expandAction = e.target.getAttribute("expand-action");
	  	
	  	switch (expandAction) {
	  		case "expand-data-row":
				updateExpandDataRowVisibility(row, row.querySelector(".expander"));
    		break;

	  		default:
	  			//console.log(e.target);
	  			//its.a('main_table event handle. no anchor handler for ' + aClass);
	  		break;
	  	}
	} 
});

// message_table event listner
messagesTable.addEventListener('click', function(e){
	its.clearAll();

  	if (e.target.nodeName === 'BUTTON'){
	  	var btnClass = e.target.className;
	  	
	  	switch (btnClass) {
	  		case "save_button":
				saveState();
			break;

			case "reset_button":
				reset();
			break;

			case "hard_reset":
				// swallow
			break;

			case "export_button":
				exportEncodedState();
			break;

			case "export_json_button":
				exportJSON();
			break;

			case "load_button":
				loadState();
			break;
			
			case "clear_button":
				clearMessages();
			break;

			case "pause_button":
				pauseResume(e.target);
			break;
    
    		case "tick_button":
    			update_timer_interval();
    		break;

	  		default:
	  			its.a('messages_table event handle. no handler for ' + btnClass);
	  		break;
	  	}    
  }
});

mainTable.addEventListener('mouseover', function(e){
	if (e.target.nodeName === 'DIV'){
		var btnClass = e.target.className;
		var row = closestParentByClass(e.target, 'item-data-row');
	  	var item_id = parseInt(row.getAttribute('item-id'));

	  	var item, prev, next, scale;

	    item = game.map[item_id];
		if (item_id > 0)
			prev = game.map[game.map[item_id].previous];
		
		if (item_id < game.num_items()-1)
			next = game.map[game.map[item_id].next];

	  	if (hasClass(e.target, "build_single"))
	  		updateBuilderElementTitle(e.target, item, prev, 0);
	  	else if (hasClass(e.target, "build_half"))
	  		updateBuilderElementTitle(e.target, item, prev, 0.5);
	  	else if (hasClass(e.target, "build_all"))
	  		updateBuilderElementTitle(e.target, item, prev, 1);
	  	/*else if (hasClass(e.target, "pull_down"))
	  		buildDown(0, item_id);
	  	else if (hasClass(e.target, "push_down"))
	  		buildDown(item_id, game.num_items()-1);*/
	  	else if (hasClass(e.target, "rate_build_single"))
	  		updateBuilderElementTitle(e.target, item, next, 0);
	  	else if (hasClass(e.target, "rate_build_half"))	 
	  		updateBuilderElementTitle(e.target, item, next, 0.5);
	  	else if (hasClass(e.target, "rate_build_all"))
	  		updateBuilderElementTitle(e.target, item, next, 1);
	  	/*else if (hasClass(e.target, "pull_up"))
	  		buildUp(game.num_items()-1,item_id);
	  	else if (hasClass(e.target, "push_up"))
	  		buildUp(item_id, 0);
	  	else
	  		its.a('main_table event handle. no button handler for ' + btnClass);*/
  	}
});
	
function updateBuilderElementTitle(el, item, other_item, scale){
	if (other_item === undefined){
		el.title = item.name + ' free';
	}else{
		var count = calcBuildCount(other_item,scale);
		if (count < 1)
			el.title = 'insufficient ' + other_item.name + ' to build '+ item.name;
		else
			el.title = numberFormat(count) + ' ' + item.name + ' needs '+ numberFormat( calcBuildCost(other_item, count)) + ' ' + other_item.name;
	}
}


// prevents text select when clicking
mainTable.addEventListener('mousedown', function(e){ e.preventDefault(); }, false);
tabBarDiv.addEventListener('mousedown', function(e){ e.preventDefault(); }, false);

window.addEventListener('focus', function(e) {
	//console.log('focus gained... resuming', e);
});

window.addEventListener('blur', function(e) {
	//console.log('focus lost... pausing',e );
});