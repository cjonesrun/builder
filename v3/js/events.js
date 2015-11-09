var last_user_action = new Date().getTime();
document.addEventListener('click', function(e){
	var timeSinceLastAction = new Date().getTime()-last_user_action;
	if (timeSinceLastAction > 10000)
		addMessage('time between user actions:', timeFormat(timeSinceLastAction));
	last_user_action = new Date().getTime();
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