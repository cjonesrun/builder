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

