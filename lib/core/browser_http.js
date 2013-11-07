module.exports = function (options, callback) {
  options.data = options.form;
  options.type = options.type || 'json';
  
  options.error = function (err) {
    callback(err);
  };
  
  options.success = function (response) {
    var body = response.self || response;
    
    callback(null, response, body);
  };
  
  return request(options);
};