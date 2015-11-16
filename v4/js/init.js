
function buildUI() {
	buildMachineDiv();
	buildHeader();
	buildTabBar();
	buildFooter();
}

function buildMachineDiv() {
	var machines_div = document.getElementById("machines_div");

	for (var i=0; i<app.pmm_defs.length; i++) {
		var p = app.pmm_defs[i];
		var d = div("pmm"+i, "pmm-container", "", "perpetual motion machine:"+p.NAME, {"data-pmm":i});
		var title = div("pmm-title"+i, "pmm-title", p.display(), "perpetual motion machine:"+p.NAME, {"data-pmm":i});
		var content = div("pmm-content"+i, "pmm-content", null, "perpetual motion machine #"+i, {"data-pmm":i});
		
		// build the row.
		for (var item in p.items){
			var d1 = div("pmm-item"+item, "pmm-item-row", null, null, {"data-pmm":i, "data-pmm-item":item});

			var d_id = div("pmm-item-id"+item, "pmm-item-id", item, p.items[item]+" title", {"data-pmm":i, "data-pmm-item":item});
			var d_name = div("pmm-item-name"+item, "pmm-item-name", p.items[item], p.items[item]+" title", {"data-pmm":i, "data-pmm-item":item});
			var d_count = div("pmm-item-count"+item, "pmm-item-count", 0, p.items[item]+" count", {"data-pmm":i, "data-pmm-item":item});
			
			var d_check = div(null, "pmm-item-auto-build", null, null, {"data-pmm":i, "data-pmm-item":item});
			d_check.appendChild( check("pmm-item-auto-build"+item, "pmm-item-auto-build", 0, p.items[item]+" auto build", {"data-pmm":i, "data-pmm-item":item}));

			d1.appendChild(d_id);
			d1.appendChild(d_name);
			d1.appendChild(d_count);
			d1.appendChild(d_check);

			content.appendChild(d1);
		}
		
		d.appendChild(title);
		d.appendChild(content);
		machines_div.appendChild(d);

		// initial state, show content of first machine
		//setVisible(content, i===0);
		d.setAttribute("data-pmm-active", i===0);

		if (i===0)
			p.active = true;
		setVisible(d, p.active);
	}
}

function buildHeader() {
	var div = document.getElementById("header_div");

}

function buildTabBar() {
	var div = document.getElementById("tab_bar_div");

}

function buildFooter() {
	var div = document.getElementById("footer_div");

}