var message_wrapper;

if ( document.getElementById('message-wrapper') ) {
  message_wrapper = document.getElementById('message-wrapper');
} else {
  message_wrapper = document.createElement('div');
  message_wrapper.setAttribute("id", "message-wrapper");
  document.body.insertBefore(message_wrapper, document.body.firstChild);
}

// Styles Config
// ( function () {
// 	  var style_tag = document.createElement('style');
// 	  var styles = [
// 	  '#message-wrapper{',
// 	    'box-sizing: border-box;',
// 	    'position: relative;',
// 	    'z-index: 100;',
// 	    'max-width: 100%;',
// 	    'margin: 0px auto;',
// 	    'line-height: 1.35;',
// 	    'background: lightgray;',
// 	    'font-family: "Lucida Sans Typewriter";',
// 	    'overflow-y: scroll;',
// 	    'overflow-x: scroll;',
//     	'max-height: 10em;',
//     	'min-height: 10em;',
// 	  '}'].join('');

// 	  style_tag.innerHTML = styles;
// 	  document.getElementsByTagName('head')[0].appendChild(style_tag);
//   })();

// arguments is a list of literals to join with single-spaces, then added to the top of the 
// message window with a limit of MESSAGE_WINDOW_LINES lines
var MESSAGE_WINDOW_LINES = 200;

function addMessage(){
	var new_line = [].slice.apply(arguments).join(" ");
	var lines = document.getElementById( 'message-wrapper' ).innerText.split("\n", MESSAGE_WINDOW_LINES-1);
	//console.log(lines);
	lines.unshift(new_line);
	document.getElementById( 'message-wrapper' ).innerText = lines.join("\n");
}

function setMessage() {
	document.getElementById( 'message-wrapper' ).innerText = "";
	var new_line = [].slice.apply(arguments).join(" ");
	addMessage(new_line);
}

function clearMessages() {
	setMessage();
}