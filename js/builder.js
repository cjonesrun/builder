var div = document.getElementById('items_div');
var html = '';

html+='<p><table border=0><tr> <th>#</th> <th>name</th> <th>count</th> <th>accumulate/s</th> <th>build/s</th>';

html += '<th colspan="3">build</th> ';
html += '<th colspan="3">rate+</th> ';

html += '<th rowspan="' + (game.items.length+1) + '">messages <input type=button value="clear" onclick="document.getElementById(\'messages\').value=\'\';"><br>' +
        '<p><textarea id="messages" rows="25" cols="60"></textarea>' +
        '</p></th>';

for (var i=0; i < game.items.length; i++) {

    html += '<tr><td>' +i+"</td> <td>" + game.items[i]+'</td>';
    
    html += "<td><input type=text value="+ numberFormat(0) +" id='"+ game.items[i] + "' size=12></td>";
    html += "<td><input type=text value='"+ numberFormat(0) +"/s' id='" + game.items[i] + "_rate' size=12></td>";
    html += "<td><input type=text value='"+ numberFormat(0) +"/s' id='" + game.items[i] + "_build_rate' size=12></td>";

    // build 1
    html += "<td><input type=\"button\"  title='build " + numberFormat(prestigeMultiplier()) + ' ' + game.items[i] + "' onclick=\"build( '" + game.items[i] + "', 0 );\" value=\"" + numberFormat(prestigeMultiplier()) +"\">";
    // build 1/2 available

    // build all
    if (i==0)
        html += "<td></td><td></td>";
    else {
        html += "<td><input type=\"button\" title='build 1/2 the max number of " + game.items[i] + "' onclick=\"build( '" + game.items[i] + "',0.5);\" value=\"1/2\">";
        html += "<td><input type=\"button\" title='build max number of " + game.items[i] + "' onclick=\"build( '" + game.items[i] + "',1);\" value=\"max\">";
    }

    // rate+ 1 per sec
    html += "<td><input type=\"button\" title='rate+ " + game.items[i] + " by " + numberFormat(prestigeMultiplier()) + "/s' onclick=\"rateInc('" + game.items[i] + "', 0);\" value='" + numberFormat(prestigeMultiplier()) +"/s'></td>";
    // rate+ 1/2 max per sec
    html += "<td><input type=\"button\" title='rate+ " + game.items[i] + " by max available " + game.next_map[game.items[i]] + "' onclick=\"buildRateInc('" + game.items[i] + "', 0.5);\" value=\"1/2\">";
    // rate+ max per sec
    html += "<td><input type=\"button\" title='rate+ " + game.items[i] + " by max available " + game.next_map[game.items[i]] + "' onclick=\"buildRateInc('" + game.items[i] + "', 1);\" value=\"max\">";

    html+='</tr>';
}

html+='</table>';
html+='</p>';

div.innerHTML+= html;

