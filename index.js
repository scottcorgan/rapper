var request = require('request');
var defaults = require('lodash.defaults');
var extend = require('lodash.assign');

var Narrator = function (options) {
  extend(this, options);
};

Narrator.create = function (options) {
  return new Narrator(options);
};

Narrator.prototype.Endpoint = function (path, objDefinition) {
  var C = objDefinition.initialize || function () {};
  
  extend(C.prototype, Narrator.prototype, this, {
    path: '/' + path
  }, objDefinition);
  
  return C;
};

Narrator.prototype._parseJSON = function (data) {
  try {
    data = JSON.parse(data);
  }
  catch (e) {}
  finally {
    return data;
  }
};

Narrator.prototype._http = function (path, method, options, callback) {
  var self = this;
  var requestOptions = {
    url: this.host + path,
    method: method
  };
  
  requestOptions = defaults(options, requestOptions);
  request(requestOptions, function (err, response, body) {
    callback(err, response, self._parseJSON(body));
  });
};

// Narrator.prototype._authenticatedHttp: function (path, method, options, callback, ignoreAuthentication) {
//   var self = this;
//   if (!Api.user) {
//     return callback('user undefined');
//   }

//   Api.user.authenticate(function (err, token) {
//     defaults(options, {
//       headers: {
//         authorization: 'Bearer ' + token
//       }
//     });
//     self._http(path, method, options, callback);
//   });
// };

Narrator.prototype._get = function (options, callback) {
  this._http(this.path, 'GET', options, callback);
},
Narrator.prototype._getById = function (id, options, callback) {
  this._http(this.path + '/' + id, 'GET', options, callback);
},
Narrator.prototype._post = function (options, callback) {
  this._http(this.path, 'POST', options, callback);
},
Narrator.prototype._put = function (id, options, callback) {
  this._http(this.path + '/' + id, 'PUT', options, callback);
},
Narrator.prototype._del = function (id, options, callback) {
  this._http(this.path + '/' + id, 'DELETE', options, callback);
},

Narrator.prototype.getAll = function (callback) {
  this._get({}, function (err, response, body) {
    callback(err, body);
  });
},

Narrator.prototype.getById = function (id, callback) {
  this._getById(id, {}, function (err, response, body) {
    callback(err, body);
  });
},

Narrator.prototype.create = function (payload, callback) {
  this._post({
    form: payload
  }, function (err, response, body) {
    callback(err, body);
  });
},

Narrator.prototype.update = function (id, payload, callback) {
  this._put(id, {form: payload}, function (err, response, body) {
    callback(err, body);
  });
},

Narrator.prototype.remove = function (id, callback) {}

module.exports = Narrator;