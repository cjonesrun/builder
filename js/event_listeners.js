var mainTable = getElement('main_table');
var messagesTable = getElement('messages_table');
var tabBarDiv = getElement("tab_bar_div");

tabBarDiv.addEventListener('click', function(e){
	its.clearAll();
	
	if (e.target.id === tabBarDiv.id)
		return;

	//console.log("click on", e.target.id, e.target.getAttribute("pmm-index"));

	var ppm_index = e.target.getAttribute("pmm-index");

	game.pmm.state[ppm_index]++;
	console.log(game.pmm.state[ppm_index]);

	e.target.textContent = "PPM" + ppm_index + ": " + game.pmm.state[ppm_index];

	/*var newDiv = document.createElement("div");
	newDiv.id = "tab_div_"+ (tabBarDiv.children.length);
	newDiv.className = "tab_bar_div_child left";
	newDiv.textContent = "PMM "+ (tabBarDiv.children.length);

	tabBarDiv.appendChild(newDiv);*/
});

// main_table event listener
mainTable.addEventListener('click', function(e){
	its.clearAll();

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
	} else if (e.target.nodeName === 'BUTTON'){
	  	var row = closestParentByClass(e.target, 'item-data-row');
	    var item_id = parseInt(row.getAttribute('item-id'));
	  	var btnClass = e.target.className;
	  	
	  	switch (btnClass) {
	  		case "build_single":
	  			build(item_id, 0);
	  		break;

	  		case "build_half":
	  			build(item_id, 0.5);
	  		break;

	  		case "build_all":
	  			build(item_id, 1);
	  		break;

	  		case "pull_down":
	  			buildDown(0, item_id);
	  		break;

	  		case "push_down":
	  			buildDown(item_id, game.num_items()-1);
			break;

			case "rate_build_single":
				buildRateInc(item_id, 0);
			break;

			case "rate_build_half":
				buildRateInc(item_id, 0.5);
			break;

			case "rate_build_all":
				buildRateInc(item_id, 1);
			break;

			case "pull_up":
				buildUp(game.num_items()-1,item_id);
			break;

			case "push_up":
				buildUp(item_id, 0);
			break;

	  		default:
	  			its.a('main_table event handle. no button handler for ' + btnClass);
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
	if (e.target.nodeName === 'TEXT'){
		var row = closestParentByClass(e.target, 'item-data-row');
		var item_id = parseInt(row.getAttribute('item-id'));

		var txtID = e.target.id;
		//console.log(e.target);
		switch (txtID) {
			case "rate":
	  		break;
		}

	}

	if (e.target.nodeName === 'BUTTON'){
		var row = closestParentByClass(e.target, 'item-data-row');
	    var item_id = parseInt(row.getAttribute('item-id'));

	    var btnClass = e.target.className;
	    var item, prev, next, scale;

	    item = game.map[item_id];
		if (item_id > 0)
			prev = game.map[game.map[item_id].previous];
		
		if (item_id < game.num_items()-1)
			next = game.map[game.map[item_id].next];

	    switch (btnClass) {
	  		case "build_single":
	  			updateBuilderElementTitle(e.target, item, prev, 0);
	  		break;
	  		case "build_half":
	  			updateBuilderElementTitle(e.target, item, prev, 0.5);
	  		break;
	  		case "build_all":
	  			updateBuilderElementTitle(e.target, item, prev, 1);
	  		break;

	  		/*case "pull_down":
	  		break;

	  		case "push_down":
			break;*/

			case "rate_build_single":
				updateBuilderElementTitle(e.target, item, next, 0);
			break;

			case "rate_build_half":
				updateBuilderElementTitle(e.target, item, next, 0.5);
			break;

			case "rate_build_all":
				updateBuilderElementTitle(e.target, item, next, 1);
			break;

			/*case "pull_up":
			break;

			case "push_up":
			break;*/

	  		default:
	  			return;
	  	}	  	
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

window.addEventListener('focus', function(e) {
	//console.log('focus gained... resuming', e);
});

window.addEventListener('blur', function(e) {
	//console.log('focus lost... pausing',e );
});