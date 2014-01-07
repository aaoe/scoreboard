
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
            'User-Agent': 'request',
            'Content-Type' : 'text/html'
                };

app.use(express.static(__dirname + '/web'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/web/index.html');
});

app.get('/messages', function(req, res) {
  request.get({
    url: api_base_url + '/messages',
    json: true,
    headers: headers
    }, function(error, response, body) {
      respond(error, response, res, body, 20);
    });
});

app.get('/message/:id', function(req, res) {
  request.get({
    url: api_base_url + '/messages/' + req.params.id,
    json: true,
    headers: headers
    }, function(error, response, body) {

    request.get({
        url: api_base_url + '/messages/' + req.params.id + '/likes',
        json: true,
        headers: headers
      }, function(error, response, b) {
        body.likes = b
        respond(error, response, res, body);
      });
    });
});

function respond(error, apiResponse, res, body, number) {
  if(!error && (apiResponse.statusCode == 200 || apiResponse.statusCode == 204)) {
    if (number) {
      return res.json(_.first(body, number));
    } else {
      return res.json(body);
    }
  } else {
    return res.send(apiResponse.statusCode, 'Error');
  }
}

// if on heroku use heroku port.
var port = process.env.PORT || 1339;
app.listen(port);
