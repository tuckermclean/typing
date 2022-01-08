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
    flash: function() {

        var FlashMode = function() {
            GameMode.call(this);

            this.lookingFor = '';
            this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            this.init = function() {
                var that = this;
                $('div#display').html('Click to begin');
                $('body').one('click', function() { that.updateKey(); });
            };

            this.randomLetter = function() {
                return this.letters[Math.floor(Math.random()*26)];
            };

            this.updateKey = function(newDisplayKey, newSpeechKey) {
                var that = this;
                if (this.lookingFor === '') {
                    this.lookingFor = this.randomLetter();
                    this.updateView();
                } else if (this.letters.indexOf(newDisplayKey) === this.letters.indexOf(this.lookingFor)) {
                    sounds.play(this.lookingFor);
                    this.lookingFor = this.randomLetter();
                    setTimeout(function() {
                        sounds.play('Tada');
                        that.updateView();
                    }, 1000);

                    $('body').addClass('rightAnswer');
                    setTimeout(function() { $('body').removeClass('rightAnswer'); }, 600);
                } else {
                    sounds.play('Ding');
                    $('body').addClass('wrongAnswer');
                    setTimeout(function() { $('body').removeClass('wrongAnswer'); }, 600);
                }
            };

            this.updateView = function() {
                if (this.lookingFor === '') {
                    $('div#display').html('You win!');
                    sounds.play('Yay');
                    initConfetti();
                    render();
                } else {
	                  $('div#display').html(this.lookingFor + ' ' + this.lookingFor.toLowerCase());
                }
            };
        };

        FlashMode.prototype = Object.create(GameMode.prototype);
        return new FlashMode();
    },

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
                if (this.displayKey.length === 1 && this.displayKey !== this.displayKey.toLowerCase()) {
                    $('div#display').html(this.displayKey + ' ' + this.displayKey.toLowerCase());
                } else {
	                  $('div#display').html(this.displayKey);
                }
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
                $('div#display').html('Click and type!');
                $('body').one('click', function() { that.updateKey(); });
            };

            this.updateKey = function(newDisplayKey, newSpeechKey) {
                var that = this;
                if (this.lookingFor === '') {
                    this.lookingFor = 'A';
                    this.updateView();
                } else if (this.letters.indexOf(newDisplayKey) === this.letters.indexOf(this.lookingFor)) {
                    this.lookingFor = this.letters.charAt(this.letters.indexOf(this.lookingFor) + 1);
                    sounds.play('Tada');
                    setTimeout(function() { that.updateView(); }, 1000);
                    $('body').addClass('rightAnswer');
                    setTimeout(function() { $('body').removeClass('rightAnswer'); }, 600);
                } else {
                    sounds.play('Ding');
                    $('body').addClass('wrongAnswer');
                    setTimeout(function() { $('body').removeClass('wrongAnswer'); }, 600);
                }
            };

            this.updateView = function() {
                if (this.lookingFor === '') {
                    $('div#display').html('You win!');
                    sounds.play('Yay');
                    initConfetti();
                    render();
                } else {
	                  $('div#display').html(this.lookingFor + ' ' + this.lookingFor.toLowerCase());
	                  sounds.play(this.lookingFor);
                }
            };
        };

        ABCMode.prototype = Object.create(GameMode.prototype);
        return new ABCMode();
    }
};

var sounds = new Sounds();
var gameMode = new GameMode();


$(document).ready( function() {

    var toggleMode = function() {

        switch($('#mode button').val()) {
        case 'wait':
        case 'abc':
            gameMode = gameModes.abc();
            $('#mode button').val('flash');
            $('#mode button').text('Flash card mode');
            break;
        case 'flash':
            gameMode = gameModes.flash();
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

    $('#mode button').click(toggleMode);

    $(document).keyup(function(event) {
	      event = event || window.event;
	      var eventKey = event.key;

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

    //-----------Var Inits--------------
    canvas = document.getElementById("effects");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cx = ctx.canvas.width / 2;
    cy = ctx.canvas.height / 2;

    let confetti = [];
    const confettiCount = 300;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;
    const colors = [
        { front: 'red', back: 'darkred' },
        { front: 'green', back: 'darkgreen' },
        { front: 'blue', back: 'darkblue' },
        { front: 'yellow', back: 'darkyellow' },
        { front: 'orange', back: 'darkorange' },
        { front: 'pink', back: 'darkpink' },
        { front: 'purple', back: 'darkpurple' },
        { front: 'turquoise', back: 'darkturquoise' }];


    //-----------Functions--------------
    resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cx = ctx.canvas.width / 2;
        cy = ctx.canvas.height / 2;
    };

    randomRange = (min, max) => Math.random() * (max - min) + min;

    initConfetti = () => {
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                color: colors[Math.floor(randomRange(0, colors.length))],
                dimensions: {
                    x: randomRange(10, 20),
                    y: randomRange(10, 30) },

                position: {
                    x: randomRange(0, canvas.width),
                    y: canvas.height - 1 },

                rotation: randomRange(0, 2 * Math.PI),
                scale: {
                    x: 1,
                    y: 1 },

                velocity: {
                    x: randomRange(-25, 25),
                    y: randomRange(0, -50) } });


        }
    };

    //---------Render-----------
    render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((confetto, index) => {
            let width = confetto.dimensions.x * confetto.scale.x;
            let height = confetto.dimensions.y * confetto.scale.y;

            // Move canvas to position and rotate
            ctx.translate(confetto.position.x, confetto.position.y);
            ctx.rotate(confetto.rotation);

            // Apply forces to velocity
            confetto.velocity.x -= confetto.velocity.x * drag;
            confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
            confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

            // Set position
            confetto.position.x += confetto.velocity.x;
            confetto.position.y += confetto.velocity.y;

            // Delete confetti when out of frame
            if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

            // Loop confetto x position
            if (confetto.position.x > canvas.width) confetto.position.x = 0;
            if (confetto.position.x < 0) confetto.position.x = canvas.width;

            // Spin confetto by scaling y
            confetto.scale.y = Math.cos(confetto.position.y * 0.1);
            ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

            // Draw confetti
            ctx.fillRect(-width / 2, -height / 2, width, height);

            // Reset transform matrix
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });

        // Fire off another round of confetti
//        if (confetti.length <= 10) initConfetti();

        window.requestAnimationFrame(render);
    };

});
