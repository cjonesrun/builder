// init from localstorage if they are present, bfore starting the timer
init(window.localStorage['builder']);

handleVisibility();

addMessage(['starting prestige is', game.prestige_base+'^'+game.prestige_level,'=', numberFormat(prestigeMultiplier()) ] );

// default hide all components.
/*var rows = document.getElementById("main_table").rows;

//(game.map[0].count > 0)
setVisible(getElement("rate_build_1_0"), (game.map[0].count > 0));
setVisible(getElement("rate_build_half_0"), (game.map[0].count > 0));
setVisible(getElement("rate_build_all_0"), (game.map[0].count > 0));
setVisible(getElement("pull_up_0"), false);

for (var i = 2; i<rows.length; i++){
    var item_index = rows[i].getAttribute("item-id");
    
    setVisible(rows[i], false);
}

function getRowByItemID(item_id) {
	var rows = document.getElementById("main_table").rows;
	for (var i = 2; i<rows.length; i++) {
    	var item_index = rows[i].getAttribute("item-id");
    	if (item_id = item_index)
    		return rows[i];
	}
}*/

function handleVisibility() {
	// determine row visibility

	// for item=0
	


	/*setVisible(getElement("rate_build_1_0"), false);
	setVisible(getElement("rate_build_half_0"), false);
	setVisible(getElement("rate_build_all_0"), false);
	setVisible(getElement("pull_up_0"), false);
*/}

getElement('main_table').addEventListener('click', function(e){
	// Clears its.a calls
    its.clearAll();

  	if (e.target.nodeName === 'BUTTON'){
	  	var row = closest(e.target, 'row');
	    var item_id = row.getAttribute('item-id');
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

	  		default:
	  			its.a('no handler for ' + btnClass);
	  		break;
	  	}    
    its.a('item: ' + item_id);
  }
});

getElement('messages_table').addEventListener('click', function(e){
	// Clears its.a calls
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

			case "export_button":
				exportState();
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
	  			its.a('no handler for ' + btnClass);
	  		break;
	  	}    
  }
});

