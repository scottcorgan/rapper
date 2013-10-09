var request = require('request');
var extend = require('lodash.assign');
var defaults = require('lodash.defaults');
var urljoin = require('url-join');

var Narrator = module.exports = function (options) {
  this._endpoints = {};
  this.host = '/';
  extend(this, options);
};

// Placed here because of circular dependency stuff
var Endpoint = require('./endpoint');

Narrator.prototype.endpoint = function (path, userDefined) {
  var fullPath = urljoin(this.host, path);
  
  if(!(fullPath in this._endpoints)) {
    var endpoint = new Endpoint({
      host: this.host,
      path: urljoin('/', path),
      headers: this.headers,
      userDefined: userDefined || {},
      _endpoints: this._endpoints
    });
    
    this._endpoints[fullPath] = endpoint;
  }
  
  return this._endpoints[fullPath];
};
