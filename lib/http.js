var request = require('request');
var defaults = require('lodash.defaults');
var extend = require('lodash.assign');

var Http = module.exports = function (options) {
  this.options = {
    headers: {},
    hooks: {},
    context: {}
  };
  
  extend(this.options, options);
};

Http.prototype.setHeaders = function (headers) {
  this.options.headers = headers;
}

Http.prototype.setHeader = function (key, value) {
  this.options.headers[key] = value;
};

Http.prototype.removeHeader = function (key) {
  delete this.options.headers[key];
};

Http.prototype._parseJSON = function (data) {
  try {
    data = JSON.parse(data);
  }
  catch (e) {}
  finally {
    return data;
  }
};

Http.prototype._http = function (path, method, options, callback) {
  var self = this;
  
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  
  var requestOptions = {
    url: path,
    method: method
  };
  
  requestOptions = defaults(options, requestOptions);
  request(requestOptions, function (err, response, body) {
    callback(err, response, self._parseJSON(body));
  });
};

Http.prototype.request = function (path, method, options, callback) {
  var self = this;
  
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  
  var httpOptions = {};
  var httpRequest = {};
  
  extend(httpOptions, {
    headers: this.options.headers
  }, options);
  
  extend(httpRequest, httpOptions, {
    path: path,
    method: method
  });
  
  // TODO: pass current api context (api, users, etc)
  process.nextTick(function () {
    var preHook = (self.options.hooks && self.options.hooks.pre) ? self.options.hooks.pre : function (next) { next(); };
    
    preHook.call(self.options.context, function () {
      self._http(path, method, httpOptions, callback);
    });
  });
};