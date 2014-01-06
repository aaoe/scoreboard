
var express = require('express');
var request = require('request');
var _ = require('underscore');
var app = express();

var user = process.env.BC_USERNAME;
var pass = process.env.BC_PASSWORD;
var api_url = "/api";
var authentication = 'http://'+ user + ':' + pass + '@';
var api_base_url =  authentication + process.env.API_URL + api_url || "http://localhost" + api_url;

var headers = {
            'User-Agent': 'request'
                };

app.get('/', function(req, res){
  res.sendfile(__dirname + '/web/index.html');
});

app.get('/messages', function(req, res) {
  request.get({
    url: api_base_url + '/messages',
    json: true,
    headers: headers
    }, function(error, response, body) {
      if(error) {
        console.log("an error has occured. keep calm and carry on.");
      }
      res.json(_.first(body, 20));
    });
});

app.get('/message/:id', function(req, res) {
  request.get({
    url: api_base_url + '/messages/' + req.params.id,
    json: true,
    headers: headers
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
