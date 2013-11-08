var extend = require('extend');
var urljoin = require('url-join');
var Promise = require('promise');

var Narrator = module.exports = function (options) {
  options = options || {};
  
  this._endpoints = {};
  this.host = '/';
  
  extend(this, options);
};

Narrator.Http = require('./http');

// Placed here because of circular dependency stuff
var Endpoint = require('./endpoint');

Narrator.prototype.endpoint = function (path, userDefined) {
  var pathKey = (this.id) ? path + this.id : path;
  
  if(!(pathKey in this._endpoints)) {
    var endpoint = new Endpoint({
      host: this.host,
      path: urljoin('/', path),
      headers: this.headers,
      userDefined: userDefined || {},
      _endpoints: this._endpoints,
      api: this
    });
    
    this._endpoints[pathKey] = endpoint;
  }
  
  return this._endpoints[pathKey];
};
