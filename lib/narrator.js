var request = require('request');
var extend = require('lodash.assign');
var defaults = require('lodash.defaults');
var urljoin = require('url-join');
var endpoint = require('./endpoint');

var Narrator = module.exports = function (options) {
  this.host = '/';
  extend(this, options);
};

Narrator.prototype.endpoint = function (path, customDeclarations) {
  var resource = {};
  
  extend(resource, endpoint, {
    host: this.host, // TODO: test this
    path: urljoin('/', path),
    headers: this.headers
  }, customDeclarations);
  
  return resource;
};
