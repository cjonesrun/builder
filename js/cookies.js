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

function init(encodedState) {
    var state = atob(encodedState);
    //console.log(encodedState);
    //console.log(state);

    clearInterval(global_timer);
    clearInterval(state_save_timer);

    game = JSON.parse(state);

    setData(); // timer.js

    startUIUpdater();
    startStateSaver();
}

function saveState()
{
    game.last_save = new Date().getTime();

    // clear the local storage first?
    //window.localStorage.clear();
    window.localStorage['builder'] = btoa(JSON.stringify(game));
    
    return window.localStorage['builder'];
}

function exportState() {
    setMessage([ saveState() ]);
}

function loadState() {
    var encodedState = document.getElementById( 'messages' ).value.trim();
    init(encodedState);
}
