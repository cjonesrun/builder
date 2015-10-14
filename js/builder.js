function boldStr(str) {
    var t1 = document.createElement("B");
    t1.innerHTML = str;
    return t1;
}

function text(id, str, title){
    var t1 = document.createElement("text");
    t1.setAttribute("id", id);
    t1.innerHTML = str;
    
    if (typeof title === 'undefined')
        t1.title = id;
    else t1.title = title;


    return t1;
}

function button(id, str, title, onclick) {
    var t1 = document.createElement("button");
    t1.setAttribute("id", id);
    t1.innerHTML = str;
    if (typeof title === 'undefined')
        t1.title = id;
    else t1.title = title;

    if (typeof onclick !== 'undefined') {
        t1.setAttribute("onclick", onclick);
    }

    return t1;
}

function buildCel(row, element, classAttr) {
    var cel = row.insertCell(-1);
    if (typeof classAttr !== 'undefined')
        cel.setAttribute("class", classAttr)

    cel.appendChild( element );
    return cel;
}

function populateTable()
{
    var main_table = document.getElementById('main_table');
    
    // header row
    var row = main_table.insertRow(-1);

    row.insertCell(-1).appendChild(boldStr("#"));
    row.insertCell(-1).appendChild(boldStr("name"));
    row.insertCell(-1).appendChild(boldStr("count"));
    row.insertCell(-1).appendChild(boldStr("accumulate/s"));
    
    row.insertCell(-1).appendChild(boldStr("build/s"));
    var cel = row.insertCell(-1);
    cel.appendChild(boldStr("build"));
    cel.setAttribute("colspan", 3);
    cel.setAttribute("align","center");
    row.insertCell(-1).appendChild(boldStr("pull"));
    
    cel = row.insertCell(-1);
    cel.appendChild(boldStr("rate+"));
    cel.setAttribute("colspan", 3);
    cel.setAttribute("align","center");
    row.insertCell(-1).appendChild(boldStr("pull"));
    
    row.insertCell(-1).appendChild(boldStr("messages"));

    // item rows
    for (var i=0; i < game.item_names.length; i++) {
        row = main_table.insertRow(-1);
        row.insertCell(-1).appendChild( text("index_" + i, i));
        row.insertCell(-1).appendChild( text("name_" + i, game.item_names[i]));


        buildCel(row, text("count_"+i, 0), 'numeric-display');
        buildCel(row, text("rate_"+i, "0/s"), 'numeric-display');
        buildCel(row, text("build_"+i, "0/s"), 'numeric-display');

        row.insertCell(-1).appendChild( button("build_1_"+i, '1', 'build ' + numberFormat(prestigeMultiplier()) + ' ' + game.map[i].name));
        if (i==0) {
            row.insertCell(-1);
            row.insertCell(-1);
            row.insertCell(-1);
        } else {
            row.insertCell(-1).appendChild( button("build_half_"+i, '1/2', 'build 1/2 the max number of ' + game.map[i].name));
            row.insertCell(-1).appendChild( button("build_all_"+i, 'max', "build max number of " + game.map[i].name));
            row.insertCell(-1).appendChild( button("pull_down_"+i, 'V', "pull all builds down to "+ game.map[i].name));
        }

        if (i < game.item_names.length-1) {
            row.insertCell(-1).appendChild( button("rate_build_1_"+i, '1', "rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s"));
            row.insertCell(-1).appendChild( button("rate_build_half_"+i, '1/2', "rate+ " + game.map[i].name + " by using 1/2 available " + game.map[game.map[i].next].name));
            row.insertCell(-1).appendChild( button("rate_build_all_"+i, 'max', "rate+ " + game.map[i].name + " by using max available " + game.map[i].next));
            row.insertCell(-1).appendChild( button("pull_up_"+i, '^', "pull all rate+ up to "+ game.map[i].name));
        }

        // last colum of first row, add messages block with rowspan=game.item_names.length 
        if (i == 0) {
            cel = row.insertCell(-1);
            cel.rowSpan = game.item_names.length;
            cel.setAttribute("valign","top");
            cel.appendChild( buildOptionsArea() );
        }
    }
    return main_table;
}



function buildOptionsArea() {
    var div = document.createElement("div");

    var mess = document.createElement("textarea");
    mess.setAttribute("id", "messages");
    mess.setAttribute("class", "main-message-area");

    div.appendChild(mess);
    div.appendChild(document.createElement("BR"));

    div.appendChild(button("save_button", "save", "save game state"));
    div.appendChild(button("reset_button", "reset", "reset game"));
    div.appendChild(button("export_button", "export", "export serialized game state to messages"));
    div.appendChild(button("load_button", "load", "load serialized game state from messages"));
    div.appendChild(button("clear_button", "clear", "clear messages"));

    div.appendChild(button("pause_button", "pause/resume", "pause/resume game ticker"));
    
    /*var p = document.createElement("P");
    p.appendChild(button("tick_button", "tick", "set game tick interval", "update_timer_interval();"));

    var txt = document.createElement("text");
    txt.innerHTML = 1000;
    txt.setAttribute("size", 6);
    txt.setAttribute("id", "timer");
    p.appendChild(txt);
    p.appendChild( text('text','ms','') );

    div.appendChild(p);*/

    return div;
}

function delegate(fcn) {
    //console.log('delegating', arguments);
    var args = [].slice.apply(arguments);
    return function() {
        console.log('inside', args.length, args.slice(1));
        args[0](args.slice(1));
    }
}
function assignFunctions() {
    getElement("save_button").addEventListener("click", saveState, false);
    getElement("reset_button").addEventListener("click", reset, false);
    getElement("export_button").addEventListener("click", exportState, false);
    getElement("load_button").addEventListener("click", loadState, false);
    getElement("clear_button").addEventListener("click", clearMessages, false);
    getElement("pause_button").addEventListener("click", pauseResume, false);

    for (var i=0; i < game.item_names.length; i++) {
        getElement("build_1_"+i).addEventListener("click", delegate( build, i, 0) , false);

        if (i>0) {
            getElement("build_1_"+i).addEventListener("click", build(i, 0.5), false);
            getElement("build_all_"+i).addEventListener("click", build(i, 1), false);
            getElement("pull_down_"+i).addEventListener("click", buildAllDownTo(i), false);
        }

        if (i < game.item_names.length-1) {
            getElement("rate_build_1_"+i).addEventListener( "click", buildRateInc(i, 0), false);
            getElement("rate_build_half_"+i).addEventListener( "click", buildRateInc(i, 0.5), false);
            getElement("rate_build_all_"+i).addEventListener( "click", buildRateInc(i, 1), false);
            getElement("pull_up_"+i).addEventListener( "click", buildAllUpTo(i), false);
        }
    }
}


function setVisible(element, visible) {
    if (visible) 
        document.getElementById(element).removeAttribute("data-visible");
    else
        document.getElementById(element).setAttribute("data-visible", "false");
}

populateTable();
assignFunctions();