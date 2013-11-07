var request = require('reqwest');

module.exports = function (options, callback) {
  options.data = options.form;
  
  options.error = function (err) {
    callback(err);
  };
  
  options.success = function (response) {
    callback(null, response, {});
  };
  
  return request(options);
};