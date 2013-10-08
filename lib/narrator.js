var request = require('request');
var extend = require('lodash.assign');
var defaults = require('lodash.defaults');
var endpoint = require('./endpoint');
var urljoin = require('url-join');

function Narrator (options) {
  this.host = '/';
  extend(this, options);
};

Narrator.prototype.endpoint = function (path, customDeclarations) {
  var resource = {};
  
  extend(resource, endpoint, {
    host: this.host, // TODO: test this
    path: urljoin('/', path)
  }, customDeclarations);
  
  return resource;
};

module.exports = Narrator;