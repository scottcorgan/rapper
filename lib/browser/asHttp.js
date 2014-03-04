module.exports = function (Http, $http) {
  Http.prototype._request = function (options, callback) {
    options.data = options.data || options.form;
    
    // Add any special xhr fields
    angular.extend(options, this.options.context.options.api._xhr);
    
    $http(options)
      .success(function (data) {
        var body = data.self || data;
        callback(null, body, body);
      }).error(function (err) {
        callback(err);
      });
  };
};