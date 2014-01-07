var request = require('request');
var q = require('q');
var _ = require('underscore');
var ansattListe = require('./ansattListe.js');

var user = process.env.BC_USERNAME;
var pass = process.env.BC_PASSWORD;
var authentication = 'http://'+ user + ':' + pass + '@';
var user_api_base_url =  authentication + process.env.USER_API_URL || "http://localhost";
var car_api_base_url =  authentication + process.env.CAR_API_URL || "http://localhost";

var headers = {
  'User-Agent': 'request'
};

var ansatte = [];

function getBilForAnsatt(ansattId){
  var deferred = q.defer();

  var ansatt = ansattListe.getAnsatte()[ansattId];

  if(ansatt.bil) {
    deferred.resolve(ansatt.bil);
    return deferred.promise;
  }

  var cars = ansatt.Cars;

  if(_.isUndefined(cars) || cars == null){
    deferred.resolve({});
    return deferred.promise;
  };

  var regnr = cars.split(",")[0].trim();


  if(regnr){
    request.get({
      url: car_api_base_url + '/api/' + regnr,
      json: true,
      headers: headers
    }, function(error, response, body) {
      if(error || body.length == 0 || body == null) {
        deferred.reject("Error fetching car");
      }

      var bil = {};
      bil.navn = body[1].value;
      bil.drivstoff = body[6].value

      ansatt.bil = bil;
      ansattListe.getAnsatte()[ansattId] = ansatt;

      deferred.resolve(bil);

    });
  }


  return deferred.promise;

}



module.exports = {
	getBilForAnsatt: getBilForAnsatt
}