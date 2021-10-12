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

function GameMode() {
    this.speechKey = '';
    this.displayKey = '';

    this.init = function() {
        console.log('Default GameMode.init() function');
    };

    this.updateKey = function(newDisplayKey, newSpeechKey) {
        this.displayKey = newDisplayKey;
        this.speechKey = newSpeechKey;
        console.log('Update: displayKey = ' + this.displayKey + ', speechKey = ' + this.speechKey);
        this.updateView();
    };

    this.updateView = function() {
        console.log('Updating view');
    };

}

var gameModes = {
    monkey: function() {

        var MonkeyMode = function() {
            GameMode.call(this);

            this.init = function() {
                $('div#display').html('Press a key');
            };

            this.updateKey = function(newDisplayKey, newSpeechKey) {
                this.speechKey = newSpeechKey;
                this.displayKey = newDisplayKey;
                this.updateView();
            };

            this.updateView = function() {
	              $('div#display').html(this.displayKey);
	              sounds.play(this.speechKey);
            };
        };

        MonkeyMode.prototype = Object.create(GameMode.prototype);
        return new MonkeyMode();

    },

    abc: function() {

        var ABCMode = function() {
            GameMode.call(this);

            this.lookingFor = '';
            this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            this.init = function() {
                var that = this;
                $('div#display').html('Press a key');
                $('body').one('click', function() { that.updateKey(); });
            };

            this.updateKey = function(newDisplayKey, newSpeechKey) {
                if (this.lookingFor === '') {
                    this.lookingFor = 'A';
                    this.updateView();
                } else if (this.letters.indexOf(newDisplayKey) === this.letters.indexOf(this.lookingFor)) {
                    this.lookingFor = this.letters.charAt(this.letters.indexOf(this.lookingFor) + 1);
                    this.updateView();
                }
            };

            this.updateView = function() {
	              $('div#display').html(this.lookingFor);
	              sounds.play(this.lookingFor);
            };
        };

        ABCMode.prototype = Object.create(GameMode.prototype);
        return new ABCMode();
    }
};

var sounds = new Sounds();
var gameMode = new GameMode();


$(document).ready( function() {

    var requestFullScreen = function() {
	      var doc = window.document;
	      var docEl = doc.documentElement;
	      var rfs = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

	      if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
	          rfs.call(window.document.documentElement);
	      }

        $("#keyboardhack")[0].focus();
    };

    var toggleMode = function() {

        switch($('#mode button').val()) {
        case 'wait':
        case 'abc':
            gameMode = gameModes.abc();
            $('#mode button').val('monkey');
            $('#mode button').text('Monkey mode');
            break;
        case 'monkey':
            gameMode = gameModes.monkey();
            $('#mode button').val('abc');
            $('#mode button').text('ABC mode');
            break;
        }

        gameMode.init();
    };

    toggleMode();

    $('body').click(requestFullScreen);
    $('#mode button').click(toggleMode);

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

        gameMode.updateKey(displayKey, speechKey);

	      return false;
    });

});
