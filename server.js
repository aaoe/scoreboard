
var express = require('express');
var request = require('request');
var app = express();


var demo_url = "https://api.github.com/users/bekkopen/repos";
app.get('/', function(req, res) {
  request('https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRkjEP5RNqYGnSWr6H-yYr4-wMnXmZo1Gjt6BhpO7m49D4p0eJV').pipe(fs.createWriteStream('doodle.png'));



});


// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
