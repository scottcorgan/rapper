var urljoin = require('url-join');
var Endpoint = require('./endpoint');

module.exports = function (options) {
  var endpoint = new Endpoint({
    host: options.host,
    path: urljoin('/', options.path),
    headers: options.headers,
    methods: options.methods || {},
    _endpoints: options._endpoints
  });
    
  return endpoint;
};