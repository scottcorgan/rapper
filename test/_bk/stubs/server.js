var Mocksy = require('mocksy');

var PORT = exports.PORT = 4756;
var STUB_HOST = exports.STUB_HOST = 'http://localhost:' + PORT;
var server = exports.server = new Mocksy({port: PORT});

var HEADERS = exports.HEADERS = {
  authorization: 'token'
};