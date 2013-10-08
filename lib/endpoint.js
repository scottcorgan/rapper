var extend = require('lodash.assign');
var urljoin = require('url-join');
var entity = require('./entity');
var _http = require('./http');
var endpoint = {};

extend(endpoint, _http, {
  path: '/',
  
  url: function () {
    return urljoin(this.host + this.path);
  },
  
  one: function (id) {
    var resource = {};
    
    
    extend(resource, entity, {
      id: id
    });
    
    return resource;
  },
  
  list: function (callback) {
    this._request(this.url(), 'GET', function (err, response, list) {
      callback(err, list);
    });
  },
  
  create: function (data, callback) {
    var requestBody = {
      form: data
    };
    
    this._request(this.url(), 'POST', requestBody, function (err, response, body) {
      callback(err, body);
    });
  }
});

module.exports = endpoint;