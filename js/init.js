// init from localstorage if they are present, bfore starting the timer
init(window.localStorage['builder']);

// main_table event listener
getElement('main_table').addEventListener('click', function(e){
	its.clearAll();

  	if (e.target.nodeName === 'BUTTON'){
	  	var row = closest(e.target, 'item-data-row');
	    var item_id = parseInt(row.getAttribute('item-id'));
	  	var btnClass = e.target.className;
	  	
	  	switch (btnClass) {
	  		case "build_1":
	  			build(item_id, 0);
	  		break;

	  		case "build_half":
	  			build(item_id, 0.5);
	  		break;

	  		case "build_all":
	  			build(item_id, 1);
	  		break;

	  		case "pull_down":
	  			buildAllDownTo(item_id);
	  		break;

	  		case "push_down":
				buildDownFrom(item_id);
			break;

			case "rate_build_1":
				buildRateInc(item_id, 0);
			break;

			case "rate_build_half":
				buildRateInc(item_id, 0.5);
			break;

			case "rate_build_all":
				buildRateInc(item_id, 1);
			break;

			case "pull_up":
				buildAllUpTo(item_id);
			break;

			case "push_up":
				buildUpFrom(item_id);
			break;

	  		default:
	  			its.a('main_table event handle. no handler for ' + btnClass);
	  		break;
	  	}    
  }
});

// message_table event listner
getElement('messages_table').addEventListener('click', function(e){
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
				pauseResume();
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

addMessage(['starting prestige is', game.prestige_base+'^'+game.prestige_level,'=', numberFormat(prestigeMultiplier()) ] );

