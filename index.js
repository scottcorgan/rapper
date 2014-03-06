'use strict';

var request = require('httpify');
var Promise = require('promise');
var extend = require('extend');
var Resource = require('./lib/resource');
var slasher = require('slasher');

var Rapper = function (host) {
  this.attributes = {};
  this.headers = {};
  this.xhrs = {};
  this.resources = {};
  
  if (host) this.attributes.host = host;
};

Rapper.prototype._addResource = function (resource) {
  this.resources[resource.url()] = resource;
};

Rapper.prototype.host = function (host) {
  if (!host) return this.attributes.host;
  
  this.attributes.host = host;
  return this;
};

Rapper.prototype._buildUrl = function (url, withHost) {
  if (withHost) return this.attributes.host + slasher(url);
  return slasher(url);
};

Rapper.prototype.header = function (key, value) {
  if (!value) return this.headers[key];
  
  this.headers[key] = value;
  return this;
};

Rapper.prototype.xhr = function (key, value) {
  if (!value) return this.xhrs[key];
  
  this.xhrs[key] = value;
  return this;
};

Rapper.prototype._http = function (url, method, options) {
  var self = this;
  var resource = this.resources[url];
  var requestOptions = {
    url: this._buildUrl(url, true),
    method: method,
    type: 'json'
  };
  
  extend(requestOptions, {
    headers: this.headers
  }, this.xhrs, options);
  
  if (!resource) return this._request(requestOptions);
  
  return this.promise(function (resolve, reject) {
    resource.beforeQueue.drain(function (err) {
      if (err) return reject(err);
      self._request(requestOptions).then(resolve, reject);
    });
  });
};

Rapper.prototype._request = function (requestOptions) {
  return this.promise(function (resolve, reject) {
    request(requestOptions, function (err, response, body) {
      if (err || response.statusCode >= 300 || response.status >= 300) return reject(err || response);
      resolve(JSON.parse(body));
    });
  });
};

// Add helper methods
Rapper.httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
Rapper.httpMethods.forEach(function (method) {
  Rapper.prototype[method.toLowerCase()] = function (url, options, resource) {
    return this._http(url, method, options, resource);
  };
});

Rapper.prototype.resource = function (name, extensions) {
  return Resource._create(name, extensions, {
    api: this,
  });
};

Rapper.prototype.promise = function (resolver) {
  return new Promise(resolver);
};

module.exports = Rapper;