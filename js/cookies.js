/*********************************************************
sets the value of a cookie
**********************************************************/
document.setCookie = function(sName,sValue)
{
    var oDate = new Date();
    oDate.setYear(oDate.getFullYear()+1);
    var sCookie = encodeURIComponent(sName) + '=' + encodeURIComponent(sValue) + ';expires=' + oDate.toGMTString() + ';path=/';
    document.cookie= sCookie;
}

/*********************************************************
gets the value of a cookie
**********************************************************/
document.getCookie = function(sName)
{
    sName = sName.toLowerCase();
    var oCrumbles = document.cookie.split(';');
    for(var i=0; i<oCrumbles.length;i++)
    {
        var oPair= oCrumbles[i].split('=');
        var sKey = decodeURIComponent(oPair[0].trim().toLowerCase());
        var sValue = oPair.length>1?oPair[1]:'';
        if(sKey == sName)
            return decodeURIComponent(sValue);
    }
    return '';
}

/*********************************************************
expires a cookie
**********************************************************/
document.clearCookie = function(sName)
{
    var oDate = new Date();
    oDate.setYear(oDate.getFullYear()-1);
    var sCookie = encodeURIComponent(sName) + '=' + ';expires=' + oDate.toGMTString() + ';path=/';
    document.cookie= sCookie;
}

function initFromCookies(encodedState) {
    var state = atob(encodedState);
    //console.log(encodedState);
    //console.log(state);

    var x = state.split('|');
    for(var i=0; i<x.length;i++)
    {
        var oPair= x[i].split('=');
        var sKey = decodeURIComponent(oPair[0].trim());
        var sValue = oPair[1];

        if (sKey == "item_count")
            item_count_map = JSON.parse(sValue);
        else if (sKey == "rate_count")
            rate_map = JSON.parse(sValue);
        else if (sKey == "game_start")
            game_started = JSON.parse(sValue);
    }
    setData(); // timer.js

}

function saveState()
{
    var state = "item_count= "+ JSON.stringify(item_count_map);
    state += "|rate_count=" + JSON.stringify(rate_map);
    state += "|game_start=" + game_started; 

    var encodedState = btoa(state);
    document.setCookie("state", encodedState);

    last_save = new Date().getTime();

    return encodedState;
}

function exportState() {
    addMessage([ saveState() ]);
}

function loadState() {
    var encodedState = document.getElementById( 'messages' ).value.trim();
    initFromCookies(encodedState);
}
