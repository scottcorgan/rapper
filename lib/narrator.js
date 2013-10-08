var request = require('request');
var extend = require('lodash.assign');
var defaults = require('lodash.defaults');
var endpoint = require('./endpoint');
var urljoin = require('url-join');

var Narrator = module.exports =  function (options) {
  this.host = '/';
  // this.path = '/';
  
  extend(this, options);
};

Narrator.prototype.endpoint = function (path, customDeclarations) {
  var resource = {};
  
  extend(resource, endpoint, {
    path: urljoin('/', path)
  }, customDeclarations);
  
  return resource;
};