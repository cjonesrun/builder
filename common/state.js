function getFromLocalStorage(param) {
    var encodedState = window.localStorage[param];
    var state;
    try {
        if (encodedState === "null" || encodedState === null)
            throw "null encodedState state";
        state = atob(encodedState);
    } catch (err) {
        console.log('malformed state obj:[', err, '].', encodedState);
        return null;
    }
    return JSON.parse(state);
}

// write the encoded state out to local storage
function saveObj(key, val)
{
    var json = JSON.stringify(val);
    console.log(json);
    window.localStorage[key] = btoa(json);
    return window.localStorage[key];
}

// takes in an array of localStorage param names to be cleared
function clearState(){
    [].slice.apply(arguments).forEach(function go(x) { window.localStorage.clear(x);});
    location.reload();
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


