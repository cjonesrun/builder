function loadGameState() {
    var encodedState = window.localStorage['builder'];
    var state;
    try {
        if (encodedState === "null" || encodedState === null)
            throw "null encodedState state";
        state = atob(encodedState);
    } catch (err) {
        console.log('malformed state obj', encodedState);
        state = JSON.stringify(new Builder());
    }

    game = JSON.parse(state);
}


// initialize the game state from the given encoded state and star/stop timers
function builderInit() {
    clearInterval(global_timer);
    clearInterval(state_save_timer);
    
    updateUI(); // functions.js

    // notify the observers
    /*for (var i in game.map) {
       Object.getNotifier(game.map[i]).performChange("update", function() { console.log('honk'); return {init: "initialized" }; });
    }*/

    startUIUpdater();
    startStateSaver();
}

// write the encoded state out to local storage
function saveState()
{
    //console.log('saving...');
    game.last_save = new Date().getTime();

    // clear the local storage first?
    //window.localStorage.clear();
    var json = JSON.stringify(game);
    window.localStorage['builder'] = btoa(json);
    
    //addMessage( [ "->state saved. size", window.localStorage['builder'].length, "bytes. compressed", lzw_encode(window.localStorage['builder']).length, 'bytes. json', json.length ] );

    /*addMessage( [ "->state saved. json size", json.length, "encoded size", window.localStorage['builder'].length, "bytes. compressed would be", lzw_encode(window.localStorage['builder']).length, 'bytes. compressed json would be', lzw_encode(json).length, 'bytes' ] );*/

    return window.localStorage['builder'];
}

// show encoded state in message window
function exportEncodedState() {
    setMessage([ saveState() ]);
}

function exportJSON() {
    setMessage([ JSON.stringify(game) ]);
}

// load an encoded state from the message window
function loadState() {
    var encodedState = document.getElementById( 'messages' ).value.trim();

    window.localStorage['builder'] = encodedState;
    location.reload();
}

function hardReset() {
    window.localStorage['builder'] = null;
    location.reload();
}

function reset() {
    // stop timers.
    //stopTimers();

    game = new Builder();
    //console.log(JSON.stringify(game));

    saveState();

    builderInit();
    /*updateUI();
*/
    setMessage( ['game reset.'] );

//    startTimers();
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