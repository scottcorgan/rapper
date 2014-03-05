var request = require('reqwest');
var extend = require('extend');

module.exports = function (options, callback) {
  options.data = options.form;
  options.type = options.type || 'json';
  
  // Add extra xhr arguments
  extend(options, this.options.context.options.api._xhr);
  
  options.error = function (response) {
    callback(response);
  };
  
  options.success = function (response) {
    var body = response.self || response;
    
    callback(null, body, body);
  };
  
  return request(options);
};