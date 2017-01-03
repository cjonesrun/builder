var machines_div = document.getElementById("machines_div");
var options_div = document.getElementById('options_div');
var message_div = document.getElementById('message-wrapper');


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
	} else if (hasClass(e.target,"pmm-enable-pm") && e.target.type==="checkbox") {
		handlePerpetualMotion( e.target.getAttribute("data-pmm"), e.target.checked );
	}

});

options_div.addEventListener('click', function(e){
	//its.clearAll();
	console.log();
	
	if (hasClass(e.target, "option_button")){
	  	var btnID = e.target.id;
	  	switch (btnID) {
	  		case "config":
    			
    			console.log("show config params")
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
