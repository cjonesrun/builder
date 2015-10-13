var div = document.getElementById('items_div');
var html = '';



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

    if (typeof onclick !== 'undefined')
        t1.setAttribute("onclick", onclick);

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
        row.insertCell(-1).appendChild( button("build_half_"+i, '1/2', 'build 1/2 the max number of ' + game.map[i].name));
        row.insertCell(-1).appendChild( button("build_all_"+i, 'all', "build max number of " + game.map[i].name));
        row.insertCell(-1).appendChild( button("pull_"+i, 'V', "pull all builds down to "+ game.map[i].name));

        if (i < game.item_names.length-1) {
            row.insertCell(-1).appendChild( button("rate_build_1_"+i, '1', "rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s"));
            row.insertCell(-1).appendChild( button("rate_build_half_"+i, '1/2', "rate+ " + game.map[i].name + " by using 1/2 available " + game.map[game.map[i].next].name));
            row.insertCell(-1).appendChild( button("rate_build_all_"+i, 'all', "rate+ " + game.map[i].name + " by using max available " + game.map[i].next));
            row.insertCell(-1).appendChild( button("pull_"+i, '^', "pull all rate+ up to "+ game.map[i].name));
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
    mess.setAttribute("id", "messages2");
    mess.setAttribute("class", "main-message-area");

    div.appendChild(mess);
    div.appendChild(document.createElement("BR"));

    div.appendChild(button("save_button", "save", "save game state", "saveState();"));
    div.appendChild(button("reset_button", "reset", "reset game", "reset();"));
    div.appendChild(button("export_button", "export", "export serialized game state to messages", "exportState();"));
    div.appendChild(button("load_button", "load", "load serialized game state from messages", "loadState();"));
    div.appendChild(button("clear_button", "clear", "clear messages", "document.getElementById('" + mess.id + "').value=\'\';"));

    div.appendChild(button("pause_button", "pause/resume", "pause/resume game ticker", "pauseResume();"));
    
    /*var p = document.createElement("P");
    p.appendChild(button("tick_button", "tick", "set game tick interval", "update_timer_interval();"));

    var txt = document.createElement("text");
    txt.innerHTML = 1000;
    txt.setAttribute("size", 6);
    txt.setAttribute("id", "timer");
    p.appendChild(txt);
    p.appendChild( text('text','ms','') );

    div.appendChild(p);*/

    var p = document.createElement("P");
    p.appendChild(boldStr("time  "));
    p.appendChild( text('running2','0','total building time') );
    div.appendChild(p);

    return div;
}



function setVisible(element, visible) {
    if (visible) 
        document.getElementById(element).removeAttribute("data-visible");
    else
        document.getElementById(element).setAttribute("data-visible", "false");
}


//populateTable();

// 5 columns
html+='<p><table border=0><tr> <th>#</th> <th>name</th> <th>count</th> <th>accumulate/s</th> <th>build/s</th>';

// 4 columns
html += '<th colspan="3">build</th> <th>pull</th>';
// 4 columns
html += '<th colspan="3">rate+</th> <th>pull</th>';
// 1 column
html += '<th valign=top rowspan="' + (game.item_names.length+1) + '">messages<br>' +
        '<p><textarea id="messages" rows="25" cols="60"></textarea>' +
        '</p><div align=left id="options_div">' +
            '<p> <input type=button value="save" onclick="saveState()"> ' +
                '<input type=button value="reset" onclick="reset()"> ' +
                '<input type=button value="export" onclick="exportState()"> '+
                '<input type=button value="load" onclick="loadState()"> <input type=button value="clear" onclick="document.getElementById(\'messages\').value=\'\';">' +
                '<input type=button value="pause/resume" onclick="pauseResume();"></p>'+

            '<p><input type=button value="tick" on onclick="update_timer_interval();"> <input type=text id="timer" value=1000 size=6>ms</p><p>time <input type=text id="running" value=0></p>' +
        '</div></th>';

for (var i=0; i < game.item_names.length; i++) {

    html += '<tr><td>' +i+"</td> <td><text id='"+ i +"_display'>"+game.map[i].name+"</text></td>";
    
    html += "<td><input type=text value="+ numberFormat(0) +" id='"+ i + "_count' size=12></td>";
    html += "<td><input type=text value='"+ numberFormat(0) +"/s' id='" + i + "_rate' size=12></td>";
    html += "<td><input type=text value='"+ numberFormat(0) +"/s' id='" + i + "_build_rate' size=12></td>";

    // build 1
    html += "<td><input type=\"button\"  title='build " + numberFormat(prestigeMultiplier()) + ' ' + game.map[i].name + "' onclick=\"build( "+i+", 0 );\" value=\"" + numberFormat(prestigeMultiplier()) +"\">";
    // build 1/2 available

    // build all
    if (i==0)
        html += "<td></td><td></td><td></td>";
    else {
        html += "<td><input type=\"button\" title='build 1/2 the max number of " + game.map[i].name + "' onclick=\"build( "+i+", 0.5);\" value=\"1/2\">";
        html += "<td><input type=\"button\" title='build max number of " + game.map[i].name + "' onclick=\"build( "+i+", 1);\" value=\"max\">";
        html += "<td><input type=\"button\" title='pull all builds down to "+ game.map[i].name +"' onclick=\"buildAllDownTo(" + i + ")\" value='V'></td>";
    }
    

    // rate+ 1 per sec
    html += "<td><input type=\"button\" title='rate+ " + game.map[i].name + " by " + numberFormat(prestigeMultiplier()) + "/s' onclick=\"buildRateInc(" + i + ", 0);\" value='" + numberFormat(prestigeMultiplier()) +"/s'></td>";
    // rate+ 1/2 max per sec
    html += "<td><input type=\"button\" title='rate+ " + game.map[i].name + " by using 1/2 available " + game.map[i].next + "' onclick=\"buildRateInc(" + i + ", 0.5);\" value=\"1/2\">";
    // rate+ max per sec
    html += "<td><input type=\"button\" title='rate+ " + game.map[i].name + " by using max available " + game.map[i].next + "' onclick=\"buildRateInc(" + i + ", 1);\" value=\"max\">";

    if (i < game.item_names.length -1)
        html += "<td><input type=\"button\" title='pull all rate+ up to "+ game.map[i].name +"' onclick=\"buildAllUpTo(" + i + ")\"  value='^'></td>";
    else 
        html += "<td></td>";
    html+='</tr>';
}

html+='</table>';
html+='</p>';

div.innerHTML+= html;

