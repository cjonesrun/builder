var div = document.getElementById('items_div');
var html = '';

html+='<p><table border=0><tr> <th>#</th> <th>name</th> <th>item_count</th> <th>accumulate/s</th> <th>build/s</th>';

html += '<th colspan="' + (levels_per_item+1) + '">build</th> ';
html += '<th colspan="' + (levels_per_item+1) + '">auto</th> ';

html += '<th rowspan="' + (items_arr.length+1) + '">messages <input type=button value="clear" onclick="document.getElementById(\'messages\').value=\'\';"><br>' +
        '<p><textarea id="messages" rows="25" cols="60"></textarea>' +
        '</p></th>';

for (var i=0; i < items_arr.length; i++) {

    html += '<tr><td>' +i+"</td> <td>" + items_arr[i]+'</td>';
    
    html += "<td><input type=text value="+ numberFormat(0) +" id='"+ items_arr[i] + "' size=15></td>";
    html += "<td><input type=text value='"+ numberFormat(0) +"/s' id='" + items_arr[i] + "_rate' size=15></td>";
    html += "<td><input type=text value='"+ numberFormat(0) +"/s' id='" + items_arr[i] + "_build_rate' size=15></td>";

    for (var j=0; j < levels_per_item; j++) {
        if (i==0 && j==0 || i>0) // hide all add buttons for item[0]
            html += "<td><input type=\"button\" onclick=\"build( '" + items_arr[i] + "', "+ j +" );\" value=\"" + numberFormat(prestigeMultiplier() * calc(j)) +"\">";
        else
            html += "<td></td>";
	}
    if (i==0)
        html += "<td></td>";
    else
        html += "<td><input type=\"button\" onclick=\"buildAll( '" + items_arr[i] + "');\" value=\"ALL\">";

	for (var j=0; j < levels_per_item; j++) {
		html += "<td><input type=\"button\" onclick=\"rateInc('" + items_arr[i] + "', "+ j +");\" value='" + numberFormat(prestigeMultiplier() * calc(j)) +"/s'></td>";
	}

    html += "<td><input type=\"button\" onclick=\"buildAllRateInc('" + items_arr[i] + "');\" value=\"ALL\">";

    html+='</tr>';
}

html+='</table>';
html+='</p>';

div.innerHTML+= html;

