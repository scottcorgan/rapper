var request = require('request');
var extend = require('lodash.assign');
var defaults = require('lodash.defaults');
var urljoin = require('url-join');
var endpoint = require('./endpoint');

var Narrator = module.exports = function (options) {
  this._endpoints = {};
  this.host = '/';
  
  extend(this, options);
};

Narrator.prototype.endpoint = function (path, customDeclarations) {
  if(!(path in this._endpoints)) {
    var resource = {};
    
    extend(resource, endpoint, {
      host: this.host, // TODO: test this
      path: urljoin('/', path),
      headers: this.headers,
      _endpoints: this._endpoints,
      endpoint: this.endpoint 
    }, customDeclarations);
    
    this._endpoints[path] = resource;
  }
  
  return this._endpoints[path];
};
