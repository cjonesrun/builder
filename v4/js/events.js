var machines_div = document.getElementById("machines_div");

// prevents text select when clicking
machines_div.addEventListener('mousedown', function(e){ e.preventDefault(); }, false);


machines_div.addEventListener('click', function(e){
	if (hasClass(e.target,"pmm-title")) {
		toggleContentVis(e.target);
	} else if (hasClass(e.target,"pmm-item-count") || 
		hasClass(e.target,"pmm-item-id") ||
		hasClass(e.target,"pmm-item-name")) {
		build(e.target.getAttribute("data-pmm"), e.target.getAttribute("data-pmm-item"), 1);
	} else if (hasClass(e.target,"pmm-item-auto-build") && e.target.type==="checkbox") {
		autoBuild( e.target.getAttribute("data-pmm"), e.target.getAttribute("data-pmm-item"), e.target.checked);
	}

});

var options_div = document.getElementById('options_div');
var message_div = document.getElementById('message-wrapper');

options_div.addEventListener('click', function(e){
	//its.clearAll();
	if (e.target.nodeName === 'BUTTON'){
	  	var btnID = e.target.id;
	  	
	  	switch (btnID) {
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

    		case "message_button":
    			
    			setVisible(message_div, !isVisible(message_div));
    			e.target.innerHTML= (isVisible(message_div)?"hide":"show") + " message box";
    		break;

	  		default:
	  			addMessage('no handler for ', btnID);
	  		break;
	  	}    
  }
});

