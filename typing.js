var displayKeys = {
    " ": "Space",
    "AltGraph": "Alt Graph",
    "CapsLock": "Caps Lock",
    "Fn": "Function",
    "FnLock": "Function Lock",
    "NumLock": "Num Lock",
    "ScrollLock": "Scroll Lock",
    "SymbolLock": "Symbol Lock",
    "ArrowLeft": "Arrow Left",
    "ArrowRight": "Arrow Right",
    "ArrowUp": "Arrow Up",
    "ArrowDown": "Arrow Down",
    "NumLock": "Num Lock",
    "PageUp": "Page Up",
    "PageDown": "Page Down",
    "Up": "Arrow Up",
    "Down": "Arrow Down",
    "Left": "Arrow Left",
    "Right": "Arrow Right",
    "Win": "Windows",
    "OS": "Windows"
};

var speechKeys = {
    "|": "Pipe",
    "@": "At",
    "#": "Hash",
    "$": "Dollar",
    "%": "Percent",
    "^": "Caret",
    "&": "Ampersand",
    "*": "Asterisk",
    "(": "Left Paren",
    ")": "Right Paren",
    "_": "Underscore",
    "+": "Plus",
    "-": "Hyphen",
    "=": "Equals",
    "{": "Left Curly Bracket",
    "}": "Right Curly Bracket",
    "[": "Left Bracket",
    "]": "Right Bracket",
    ":": "Colon",
    ";": "Semicolon",
    "\"": "Double Quote",
    "'": "Single Quote",
    "<": "Less Than",
    ">": "Greater Than",
    ",": "Comma",
    ".": "Period",
    "?": "Question Mark",
    "!": "Exclamation Point",
    "/": "Slash",
    "\\": "Backslash",
    "`": "Backtick",
    "~": "Tilde",
};

$(document).ready( function() {
    var requestFullScreen = function() {
	      var doc = window.document;
	      var docEl = doc.documentElement;
	      var rfs = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

	      if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
	          rfs.call(window.document.documentElement);
	      }
    };

    requestFullScreen();

    $('body').click(function(event) {
	      $("#keyboardhack").trigger('focus');
	      requestFullScreen();
    });

    var sounds = new Sounds();

    $(document).keyup(function(event) {
	      event = event || window.event;
	      var eventKey = event.key;

	      requestFullScreen();

	      if (eventKey === "Unidentified") {
	          var keyboardHackText = $("#keyboardhack").val();
	          if (keyboardHackText !== undefined || keyboardHackText !== "") {
		            eventKey = keyboardHackText.slice(-1);
		            $("#keyboardhack").val("");
	          }
	      }

	      var displayKey = displayKeys[eventKey] || eventKey || 'BOING!';

	      if (/^[a-z]$/.test(displayKey)) {
	          displayKey = displayKey.toUpperCase();
	      }

	      var speechKey = speechKeys[eventKey] || displayKey;

	      //	$('div#display').html(displayKey.charCodeAt(0) + ": " + displayKey);
	      $('div#display').html(displayKey);

	      sounds.play(speechKey);

	      return false;
    });

});
