// initialize the game state from the given encoded state
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

// write the encoded state out to local storage
function saveState()
{
    game.last_save = new Date().getTime();

    // clear the local storage first?
    //window.localStorage.clear();
    window.localStorage['builder'] = btoa(JSON.stringify(game));
    
    //console.log("save state:", window.localStorage['builder'].length, "compressed:", lzw_encode(window.localStorage['builder']).length);

    return window.localStorage['builder'];
}

// show encoded state in message window
function exportState() {
    setMessage([ saveState() ]);
}

// load an encoded state from the message window
function loadState() {
    var encodedState = document.getElementById( 'messages' ).value.trim();
    init(encodedState);
}

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict['_' + phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
            dict['_' + phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}
 
// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict['_'+currCode] ? dict['_'+currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict['_'+code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}