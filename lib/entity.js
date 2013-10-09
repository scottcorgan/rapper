var extend = require('lodash.assign');
var Http = require('./http');
var urljoin = require('url-join');
var defaults = require('lodash.defaults');

var Entity = module.exports = function (options) {
  this.hooks = {
    pre: function (next) { next(); }
  };
  
  this.options = {
    host: '',
    path: '',
    headers: {},
    id: 0,
    _endpoints: {}
  };
  
  if (!options.userDefined) {
    options.userDefined = {};
  }
  
  defaults(options.userDefined.hooks, this.hooks);
  
  extend(this.options, options);
  extend(this, options.userDefined);
  
  this.http = new Http({
    context: this,
    headers: this.options.headers,
    hooks: this.hooks
  });
};

// Placed here because of circular dependency stuff
var Narrator = require('./narrator');

Entity.prototype.endpoint = function (path, customMethods) {
  var api = new Narrator({
    id: this.options.id,
    host: this.url(),
    headers: this.options.headers,
    _endpoints: this.options._endpoints
  });
  
  return api.endpoint(path, customMethods);
};

Entity.prototype.url = function () {
  return urljoin(this.options.host, this.options.path, this.options.id);
};

Entity.prototype.get = function (callback) {
  this.http.request(this.url(), 'GET', function (err, response, data) {
    callback(err, data);
  });
};

Entity.prototype.update = function (payload, callback) {
  var requestBody = {
    form: payload
  };
  
  this.http.request(this.url(), 'PUT', requestBody, function (err, response, body) {
    callback(err, body);
  });
};

Entity.prototype.remove = function (callback) {
  this.http.request(this.url(), 'DELETE', function (err, response, body) {
    callback(err, body);
  });
};

Entity.prototype.getEndpoint = function (path, id) {
  var pathKey = (id) ? path + id : path;
  return this.options._endpoints[pathKey];
}
