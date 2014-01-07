var request = require('request');
var q = require('q');
var _ = require('underscore');

var user = process.env.BC_USERNAME;
var pass = process.env.BC_PASSWORD;
var authentication = 'http://'+ user + ':' + pass + '@';
var user_api_base_url =  authentication + process.env.USER_API_URL || "http://localhost";

var headers = {
  'User-Agent': 'request'
};

var ansatte = [];

function cacheAnsattListe(){
	
	request.get({
    url: user_api_base_url + '/all',
    json: true,
    headers: headers
  }, function(error, response, body) {
    if(error) {
      console.log("an error has occured. keep calm and carry on.");
    }

    _.each(body, function(employee){
    	return getAnsatt(employee.Id).then(function(fullEmployee) {
    		ansatte.push(fullEmployee[0]);
    	});
    });

  });
}

function getAnsatt(id) {
	var deferred = q.defer();

 request.get({
    url: user_api_base_url + '/employee/' + id,
    json: true,
    headers: headers
  }, function(error, response, body) {
    if(error) {
      console.log("an error has occured. keep calm and carry on.");
      deferred.reject("Error!");
    }
    
    deferred.resolve(body);
  });
 
 	return deferred.promise;
}

function getAnsatte() {
	return ansatte;
}

module.exports = {
	cacheAnsattListe: cacheAnsattListe,
	getAnsatte: getAnsatte
}