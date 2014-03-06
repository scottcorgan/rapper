var request = require('httpify');
var Promise = require('promise');
var extend = require('extend');
var Resource = require('./lib/resource');
var slasher = require('slasher');

var Rapper = function () {
  this.attributes = {};
  this.headers = {};
  this.xhrs = {};
};

Rapper.prototype._setValue = function (key, value) {
  this.attributes[key] = value;
};

Rapper.prototype._getValue = function (key) {
  return this.attributes[key];
};

Rapper.prototype.host = function (host) {
  if (!host) return this._getValue('host');
  
  this._setValue('host', host);
  return this;
};

Rapper.prototype._buildUrl = function (url, withHost) {
  if (withHost) return this._getValue('host') + slasher(url);
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
  var requestOptions = {
    url: this._buildUrl(url, true),
    method: method,
    type: 'json'
  };
  
  extend(requestOptions, {
    headers: this.headers
  }, this.xhrs, options);
  
  return this.promise(function (resolve, reject) {
    request(requestOptions, function (err, response, body) {
      if (err || response.statusCode >= 300 || response.status >= 300) {
        reject(err || response);
      }
      else{
        body = JSON.parse(body);
        resolve(body);
      }
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
  var ext = {};
  extend(ext, Resource.many, extensions);
  
  return new Resource({
    name: name,
    api: this
  }, ext);
};

Rapper.prototype.promise = function (resolver) {
  return new Promise(resolver);
};

module.exports = Rapper;