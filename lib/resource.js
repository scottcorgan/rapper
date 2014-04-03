'use strict';

var extend = require('extend');
var slasher = require('slasher');
var path = require('path');
var Qmap = require('qmap');

var Resource = function (options, extensions) {
  this._params = {};
  this.xhrOptions = {};
  this.beforeQueue = new Qmap(this);
  extend(this, options, extensions);
};

Resource.prototype.url = function (withHost) {
  return this.api._buildUrl(this, withHost);
};

Resource.prototype.one = function (name, extensions) {
  return Resource._create(name, extensions, {
      type: 'one',
      api: this.api,
      baseUrl: this.url()
    });
};

Resource.prototype.resource = function (name, extensions) {
  return Resource._create(name, extensions, {
    type: 'many',
    api: this.api,
    baseUrl: this.url()
  });
};

Resource.prototype.xhrOption = function (key, value) {
  if (!value) return this.xhrOptions[key];
  
  this.xhrOptions[key] = value;
  return this;
};

Resource.prototype.before = function () {
  this.beforeQueue.push(arguments);
};

Resource.prototype.alias = function (originalMethod, aliasedMethod) {
  this[aliasedMethod] = this[originalMethod];
  return this;
};

Resource.prototype.param = function (key, value) {
  if (!value) return this._params[key];
  
  this._params[key] = value;
  return this;
};

Resource.prototype.params = function (params) {
  if (!params) return this._params;
  
  extend(this._params, params);
  return this;
};


// Mixins
Resource.many = {
  get: function () {
    return this.api.get(this.url(), this.xhrOptions);
  },
  post: function (body) {
    return this.api.post(this.url(), extend(this.xhrOptions, {
      form: body
    }));
  },
  
  // Aliases
  list: function () {
    return this.get();
  },
  create: function (body) {
    return this.post(body);
  }
};

Resource.one = {
  get: Resource.many.get,
  put: function (body) {
    return this.api.put(this.url(), extend(this.xhrOptions, {
      form: body
    }));
  },
  del: function () {
    return this.api.delete(this.url(), this.xhrOptions);
  },
  
  // Aliases
  update: function (body) {
    return this.put(body);
  },
  remove: function () {
    return this.del();
  },
};

Resource._create = function (name, extensions, options) {
  var ext = {};
  var parsedName = path.join(options.baseUrl || '/', slasher(name));
  var api = options.api;
  
  extend(ext, Resource[options.type || 'many'], extensions);
  
  if (api.resources[parsedName]) return api.resources[parsedName];
  
  var resource = new Resource({
    name: parsedName,
    api: api
  }, ext);
  
  api.resources[resource.url()] = resource;
  
  return resource;
};

module.exports = Resource;