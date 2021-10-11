var Sounds = function() {
    var soundData = new SoundData();
    var that = this;

    this.audioContext = new AudioContext();
    this.playing = undefined;
    this.sounds = {};
    
    var initSound = function(name) {
	req = new XMLHttpRequest();
	req.open('GET', soundData[name])
	req.responseType = 'arraybuffer';
	req.onload = function(e) {
            that.audioContext.decodeAudioData(e.target.response, function(buffer) {
		delete soundData[name];
		that.sounds[name] = { buffer: buffer };
		var setup = function() {
		    that.sounds[name].source = that.audioContext.createBufferSource();
       		    that.sounds[name].source.buffer = buffer;
   		    that.sounds[name].source.connect(that.audioContext.destination);
   		    that.sounds[name].source.loop = false;
   		};
   		that.sounds[name].play = function() {
		    if (that.audioContext.state !== "running") {
			that.audioContext.resume();
		    }
		    if (that.playing instanceof AudioBufferSourceNode) {
//			that.playing.stop();
		    }
		    if (that.playing !== that.sounds[name].source) {
			that.playing = that.sounds[name].source;
   			that.sounds[name].source.start();
			that.sounds[name].source.onended = function() {
			    if (that.playing === that.sounds[name].source) {
				that.playing = undefined;
			    }
   			    setup();
			};
		    }
   		}
		setup();
            });
	};
	req.send();
    };
    
    Object.keys(soundData).forEach(initSound);
    this.play = function(name) {
	if (that.sounds[name] !== undefined &&
	    that.sounds[name].play !== undefined) {
	    that.sounds[name].play();
	} else {
	    that.sounds["Stop Aurora"].play();
	}
    };
};
