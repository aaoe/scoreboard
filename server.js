
var express = require('express');
var request = require('request');
var _ = require('underscore');
var http = require('http');
var q = require('q');
var app = express();

var ansattListe = require('./ansattListe.js');

var user = process.env.BC_USERNAME;
var pass = process.env.BC_PASSWORD;
var api_url = "/api";
var authentication = 'http://'+ user + ':' + pass + '@';
var api_base_url =  authentication + process.env.API_URL + api_url || "http://localhost" + api_url;
var user_api_base_url =  authentication + process.env.USER_API_URL || "http://localhost";

var headers = {
  'User-Agent': 'request',
  'Content-Type' : 'text/html'
};

ansattListe.cacheAnsattListe();

app.use(express.static(__dirname + '/web'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/web/index.html');
});

//SOCIALCAST INTEGRATION
app.get('/messages', function(req, res) {
  request.get({
    url: api_base_url + '/messages',
    json: true,
    headers: headers
  }, function(error, response, body) {
    if(error) {
      console.log("an error has occured. keep calm and carry on.");
    }

    var messages = _.first(body, 20);

    var messagesWithEmployeeInfo = _.map(messages, function(message) {
      if(message.user){
        var employee = getEmployee(message.user.name);

          if(employee){
            message.user.senioritet = employee.Seniority;
            message.user.avdeling = employee.Department; 
          }  
      } 

      return message;

      });

    respond(error, response, res, messagesWithEmployeeInfo, 20);
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

function getEmployee(name) {
  return _.find(ansattListe.getAnsatte(), function(ansatt) {
      if(findName(name, ansatt.Name)) {
        return ansatt;
      }
  });
}

function findName(scName, bekkName) {
  if(scName == bekkName) {
    return true;
  }

  var bekkNames = bekkName.split(" ");
  var scNames = scName.split(" ");
  var i = 0;

  _.each(scNames, function(scPartOfName) {
      _.each(bekkNames, function(bekkPartOfName) {
          if(scPartOfName == bekkPartOfName) {
            i++;
          }
      });
  });

  if(i >= 2) {
    return true;
  }

  return false;
}


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
