/*
  Needed this one-off script to convert a bunch of dataurls into files again.
  To use it, cat it to the end of the sounddata.js file, then run with node
 */

fs = require ('fs');

var soundData = new SoundData();

try
{
    Object.keys(soundData).forEach
    (
        function(name)
        {
            var dataUrl = soundData[name];
            var dataBase64 = dataUrl.substr(dataUrl.indexOf('base64') + 7);
            var buffer = Buffer.from(dataBase64, 'base64');

            fs.writeFileSync(name + '.mp3', buffer);
        }
    );
}
catch (e)
{
    console.log(e);
}
