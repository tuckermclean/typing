var fs = require('fs');
var glob = require('glob');

var soundData = {};

glob.glob(
    './sounds/*.mp3',
    function(e, files)
    {
        files.forEach(
            function(file)
            {
                var name = file.slice(9, -4);
                soundData[name] = file;
            }
        );

        console.log(soundData);
    }
);
