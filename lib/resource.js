var extend = require('extend');
var slasher = require('slasher');
var path = require('path');

var Resource = function (options, extensions) {
  this.xhrs = {};
  
  extend(this, options, extensions);
};

Resource.prototype.url = function (withHost) {
  return this.api._buildUrl(this.name, withHost);
};

Resource.prototype.one = function (name, extensions) {
  var ext = {};
  extend(ext, Resource.one, extensions);
  
  return new Resource({
    name: path.join(this.url(), slasher(name)),
    api: this.api
  }, ext);
};

Resource.prototype.resource = function (name, extensions) {
  var ext = {};
  extend(ext, Resource.many, extensions);
  
  return new Resource({
    name: path.join(this.url(), slasher(name)),
    api: this.api
  }, ext);
};

Resource.prototype.xhr = function (key, value) {
  if (!value) return this.xhrs[key];
  
  this.xhrs[key] = value;
  return this;
};


// Mixins
Resource.many = {
  get: function () {
    return this.api.get(this.url(), this.xhrs);
  },
  post: function (body) {
    return this.api.post(this.url(), extend(this.xhrs, {
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
    return this.api.put(this.url(), extend(this.xhrs, {
      form: body
    }));
  },
  del: function () {
    return this.api.delete(this.url(), this.xhrs);
  },
  
  // Aliases
  update: function (body) {
    return this.put(body);
  },
  remove: function () {
    return this.del();
  },
};

module.exports = Resource;