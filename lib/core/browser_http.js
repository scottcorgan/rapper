var request = require('reqwest');

module.exports = function (options, callback) {
  options.data = options.form;
  options.type = options.type || 'json';
  
  options.error = function (response) {
    callback(response);
  };
  
  options.success = function (response) {
    var body = response.self || response;
    
    callback(null, body, body);
  };
  
  return request(options);
};