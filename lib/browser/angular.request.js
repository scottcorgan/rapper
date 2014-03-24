'use strict';

module.exports = function ($http, $q) {
  return function (requestOptions) {
    var d = $q.defer();
    
    if (requestOptions.form) requestOptions.data = requestOptions.form;
    if (requestOptions.type) requestOptions.responseType = requestOptions.type;
    
    $http(requestOptions).success(function (res) {
      d.resolve(res);
    }).error(function (err) {
      d.reject(err);
    });
    
    return d.promise;
};
};