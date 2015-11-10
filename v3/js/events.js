var last_user_action = new Date().getTime();
document.addEventListener('click', function(e){
	var timeSinceLastAction = new Date().getTime()-last_user_action;
	if (timeSinceLastAction > 10000)
		addMessage('time between user actions:', timeFormat(timeSinceLastAction));
	last_user_action = new Date().getTime();
});

var main_table = document.getElementById("main_table");
main_table.addEventListener('click', function(e){
	var row = closestParentByClass(e.target, 'item-data-row');
	
	if (row === null)
		return;
	var item_id = parseInt(row.getAttribute('item-id'));
	//console.log(game.map[item_id].name);
	if (e.target.nodeName === 'DIV'){
		var btnClass = e.target.className;
		
	  	if (hasClass(e.target, "build_single")){
	  		build(item_id, 1);
	  	}
	 }
	 /*else if (hasClass(e.target, "build_half"))
	  		build(item_id, 0.5);
	  	else if (hasClass(e.target, "build_all"))
	  		build(item_id, 1);
	  	else if (hasClass(e.target, "pull_down"))
	  		buildDown(0, item_id);
	  	else if (hasClass(e.target, "push_down"))
	  		buildDown(item_id, game.num_items()-1);
	  	else if (hasClass(e.target, "rate_build_single")){
	  		//buildRateInc(item_id, 0);
	  		buildR(item_id);
	  	} else if (hasClass(e.target, "rate_build_half"))	 
	  		buildRateInc(item_id, 0.5); 		
	  	else if (hasClass(e.target, "rate_build_all"))
	  		buildRateInc(item_id, 1);
	  	else if (hasClass(e.target, "pull_up"))
	  		buildUp(game.num_items()-1,item_id);
	  	else if (hasClass(e.target, "push_up"))
	  		buildUp(item_id, 0);
	  	else
	  		its.a('main_table event handle. no button handler for ' + btnClass);
  	}*/
});

var options_div = document.getElementById('options_div');

options_div.addEventListener('click', function(e){
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
				hardReset();
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

    		case "stats":
    			showGameStats();
    		break;

	  		default:
	  			addMessage('no handler for ', btnClass);
	  		break;
	  	}    
  }
});

// prevents text select when clicking
document.getElementById('header_div').addEventListener('mousedown', function(e){ e.preventDefault(); }, false);
document.getElementById('tab_bar_div').addEventListener('mousedown', function(e){ e.preventDefault(); }, false);
document.getElementById('main_div').addEventListener('mousedown', function(e){ e.preventDefault(); }, false);
