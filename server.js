
var express = require('express');
var request = require('request');
var app = express();

var user = process.env.BC_USERNAME || 'user';
var pass = process.env.BC_PASSWORD || 'pass';
var api_url = "/api";
var api_base_url = 'http://'+ user + ':' + pass + '@' + process.env.API_URL + api_url || "http://localhost" + api_url;

app.get('/messages', function(req, res) {
  request.get({
    url: api_base_url + '/messages',
    json: true,
    headers: {
            'User-Agent': 'request'
                }
    }, function(error, response, body) {
      if(error) {
        console.log("an error has occured. keep calm and carry on.");
      }
      res.json(body);
    });
});

app.get('/message/:id', function(req, res) {
  request.get({
    url: api_base_url + '/messages/' + req.params.id,
    json: true,
    headers: {
            'User-Agent': 'request'
                }
    }, function(error, response, body) {
      if(error) {
        console.log("an error has occured. keep calm and carry on.");
      }
      res.json(body);
    });
});


// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
