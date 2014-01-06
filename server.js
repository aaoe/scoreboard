
var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();


var demo_url = "https://api.github.com/users/bekkopen/repos";
app.get('/', function(req, res) {
  request('http://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Super_Series_2007_Scoreboard.jpg/800px-Super_Series_2007_Scoreboard.jpg').pipe(fs.createWriteStream('doodle.png'));



});


// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
