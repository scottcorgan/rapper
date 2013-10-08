// Must declare here to handle circular dependencies
var entity = module.exports = {};

var Narrator = require('./narrator');
var extend = require('lodash.assign');
var _http = require('./http');
var urljoin = require('url-join');

entity.url = function () {
  return urljoin(this.host, this.path, this.id);
}

entity.endpoint = function (path, customDeclarations) {
  var api = new Narrator({
    host: this.url(),
    headers: this.headers
  });
  
  return api.endpoint(path, customDeclarations);
}

entity.get = function (callback) {
  this._request(this.url(), 'GET', function (err, response, data) {
    callback(err, data);
  });
}

entity.update = function (data, callback) {
  var requestBody = {
    form: data
  };
  
  this._request(this.url(), 'PUT', requestBody, function (err, response, body) {
    callback(err, body);
  });
  
}

entity.remove = function (callback) {
  this._request(this.url(), 'DELETE', function (err, response, body) {
    callback(err, body);
  });
}

extend(entity, _http);