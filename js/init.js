// init from localstorage if they are present, bfore starting the timer
init(window.localStorage['builder']);

// main_table event listener
getElement('main_table').addEventListener('click', function(e){
	its.clearAll();

  	if (e.target.nodeName === 'BUTTON'){
	  	var row = closestParentByClass(e.target, 'item-data-row');
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
	  			buildDown(0, item_id);
	  		break;

	  		case "push_down":
	  			buildDown(item_id, game.item_names.length-1);
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
				buildUp(game.item_names.length-1,item_id);
			break;

			case "push_up":
				buildUp(item_id, 0);
			break;

			case "expand":
				var rowToShow = getElement(row.getAttribute("expanded-item-data-row"));
				
				var arr = document.getElementsByClassName("expanded-item-data-row");

				for (var i = 0; i < arr.length; i++){
					// collapse everything
					if (rowToShow.id !== arr[i].id) {
						setVisible(arr[i], false);
						arr[i].previousSibling.getElementsByClassName("expand")[0].innerHTML = "+";
					}
				}

				if (isVisible( rowToShow )){
					e.target.innerHTML = "+";
					setVisible(rowToShow, false);
				} else {
					e.target.innerHTML = "-";
					setVisible(rowToShow, true);
				}
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

getElement('main_table').addEventListener('mouseover', function(e){
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
	    var item, scale;

	    var txt;
	    switch (btnClass) {
	  		case "build_1":
	  			scale = 0;
	  		break;
	  		case "build_half":
	  			scale = 0.5;
	  		break;
	  		case "build_all":
	  			scale = 1;
	  		break;

	  		/*case "pull_down":
	  		break;

	  		case "push_down":
			break;

			case "rate_build_1":
				scale = 0;
			break;

			case "rate_build_half":
				scale = 0.5;
			break;

			case "rate_build_all":
				scale = 1;
			break;

			case "pull_up":
			break;

			case "push_up":
			break;*/

	  		default:
	  			return;
	  	}
	  	if (item_id < game.item_names.length-1)
			item = game.map[item_id+1];
		else 
			item = game.map[item_id];
		//e.target.setAttribute("title", 'cost '+ numberFormat(calcBuildCost(item, scale)) + ' ' + item.name);
		e.target.title = 'cost '+ numberFormat( calcBuildCost(item, calcBuildCount(item,scale))) + ' ' + item.name;
	  	
	}
});


window.addEventListener('focus', function(e) {

	//console.log('focus gained... resuming', e);
});

window.addEventListener('blur', function(e) {
	//console.log('focus lost... pausing',e );

});

addMessage(['starting prestige is', game.prestige_base+'^'+game.prestige_level,'=', numberFormat(prestigeMultiplier()) ] );