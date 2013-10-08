var request = require('request');
var defaults = require('lodash.defaults');
var extend = require('lodash.assign');

var http = module.exports = {
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
    
    var self = this;
    var requestOptions = {
      url: path,
      method: method
    };
    
    requestOptions = defaults(options, requestOptions);
    request(requestOptions, function (err, response, body) {
      callback(err, response, self._parseJSON(body));
    });
  },
  
  _request: function (path, method, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    
    var httpOptions = {};
    
    extend(httpOptions, {
      headers: this.headers
    }, options);
    
    this._http(path, method, httpOptions, callback);
  }
};