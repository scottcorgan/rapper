var request = require('request');
var extend = require('lodash.assign');
var defaults = require('lodash.defaults');
var urljoin = require('url-join');
var Endpoint = require('./endpoint');

var Narrator = module.exports = function (options) {
  this._endpoints = {};
  this.host = '/';
  
  extend(this, options);
};

Narrator.prototype.endpoint = function (path, customMethods) {
  var fullPath = urljoin(this.host, path);
  
  if(!(path in this._endpoints)) {
    this._endpoints[fullPath] = new Endpoint({
      host: this.host,
      path: urljoin('/', path),
      headers: this.headers,
      methods: customMethods,
      _endpoints: this._endpoints
    });
    
    
    // var resource = {};
    
    // extend(resource, endpoint, {
    //   host: this.host, // TODO: test this
    //   path: urljoin('/', path),
    //   headers: this.headers,
    //   _endpoints: this._endpoints,
    //   endpoint: this.endpoint 
    // }, customDeclarations);
    
    // this._endpoints[path] = resource;
  }
  
  return this._endpoints[fullPath];
};
