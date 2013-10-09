// Must declare here to handle circular dependencies
var endpoint = module.exports = {};

var clone = require('lodash.clone');
var extend = require('lodash.assign');
var urljoin = require('url-join');
var entity = require('./entity');
var _http = require('./http');

endpoint.path = '/';

endpoint.url = function () {
  return urljoin(this.host + this.path);
};
  
endpoint.one = function (id) {
  var resource = {};
  
  extend(resource, entity, {
    _endpoints: this._endpoints,
    endpoint: this.endpoint,
    host: this.host,
    path: this.path,
    id: id,
    pre: this.pre,
    headers: this.headers
  });
  
  return resource;
},

endpoint.list = function (callback) {
  this.request(this.url(), 'GET', function (err, response, list) {
    callback(err, list);
  });
},

endpoint.create = function (data, callback) {
  var requestBody = {
    form: data
  };
  
  this.request(this.url(), 'POST', requestBody, function (err, response, body) {
    callback(err, body);
  });
}

extend(endpoint, _http);
