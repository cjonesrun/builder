var div = document.getElementById('items_div');
var html = '';

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

