'use strict';

var request = require('httpify');
var Promise = require('promise');
var extend = require('extend');
var Resource = require('./lib/resource');
var slasher = require('slasher');
var qs = require('qs');

var Rapper = function (host) {
  this.attributes = {};
  this.headers = {};
  this.xhrOptions = {};
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

Rapper.prototype._buildUrl = function (resource, withHost) {
  var url = (typeof resource === 'string') ? resource : paramJoin(slasher(resource.name), resource.params());
  return (withHost) ? this.host() + url : url;
};

Rapper.prototype.header = function (key, value) {
  if (!value) return this.headers[key];
  
  this.headers[key] = value;
  return this;
};

Rapper.prototype.xhrOption = function (key, value) {
  if (!value) return this.xhrOptions[key];
  
  this.xhrOptions[key] = value;
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
  }, this.xhrOptions, options);
  
  if (!resource) return this._makeHttpRequest(requestOptions);
  
  return this.promise(function (resolve, reject) {
    resource.beforeQueue.drain(function (err) {
      if (err) return reject(err);
      self._makeHttpRequest(requestOptions).then(resolve, reject);
    });
  });
};

Rapper.prototype._makeHttpRequest = function (requestOptions) {
  return this.promise(function (resolve, reject) {
    request(requestOptions, function (err, response) {
      
      // Some error happened
      if (err) return reject(err);
      
      // Parse body
      if (response.body === '') response.body = {};
      if (typeof response.body === 'string') {
        try{
          response.body = JSON.parse(response.body);
        }
        catch (e) {}
      }
      
      // Oops, not a good resposne
      if (response.statusCode >= 400) return reject(response);
      
      // All good
      resolve(response);
    });
  });
};

// Add helper methods
Rapper.httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
Rapper.httpMethods.forEach(function (method) {
  Rapper.prototype[method.toLowerCase()] = function (url, options) {
    return this._http(url, method, options);
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

Rapper.prototype.asPromise = function (value) {
  return this.promise(function (resolve) {
    resolve(value);
  });
};

module.exports = Rapper;

// TODO: break this out into own module
function paramJoin (url, params) {
  if (params instanceof Object) params = qs.stringify(params);
  
  if (url.indexOf('?') > -1 && params !== '') url += '&' + params;
  if (url.indexOf('?') < 0 && params !== '') url += '?' + params;
  
  return url;
}