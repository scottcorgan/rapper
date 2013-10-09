var request = require('request');
var defaults = require('lodash.defaults');
var extend = require('lodash.assign');

var http = module.exports = {
  hooks: {},
  headers: {},
  
  setHeaders: function (headers) {
    this.headers = headers;
  },
  
  _parseJSON: function (data) {
    try {
      data = JSON.parse(data);
    }
    catch (e) {}
    finally {
      return data;
    }
  },
  
  _http: function (path, method, options, callback) {
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
      callback(err, response, http._parseJSON(body));
    });
  },
  
  request: function (path, method, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    
    var httpOptions = {};
    var httpRequest = {};
    
    extend(httpOptions, {
      headers: this.headers
    }, options);
    
    extend(httpRequest, httpOptions, {
      path: path,
      method: method
    });
    
    var preHook = this.pre || function (api, next) { next(); };
    
    preHook(this, function () {
      http._http(path, method, httpOptions, callback);
    });
  }
};