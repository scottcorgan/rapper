var extend = require('lodash.assign');
var _http = require('./http');
var Narrator = require('./narrator');
var urljoin = require('url-join');
var entity = {};

extend(entity, _http ,{
  url: function () {
    return urljoin(this.host, this.path, this.id);
  },
  
  endpoint: function (path, customDeclarations) {
    // var nestedApi = new Narrator({
    //   host: this.url(),
    //   headers: this.headers
    // });
    
    // return nestedApi;
  },
  
  get: function (callback) {
    this._request(this.url(), 'GET', function (err, response, data) {
      callback(err, data);
    });
  },
  
  update: function (data, callback) {
    var requestBody = {
      form: data
    };
    
    this._request(this.url(), 'PUT', requestBody, function (err, response, body) {
      callback(err, body);
    });
    
  },
  
  remove: function (callback) {
    this._request(this.url(), 'DELETE', function (err, response, body) {
      callback(err, body);
    });
  }
});

module.exports = entity;