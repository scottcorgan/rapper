'use strict';

module.exports = function ($q) {
  return function (callback) {
    var d = $q.defer();
    
    callback(function (data) {
        d.resolve(data);
    }, function (err) {
        d.reject(err);
    });
    
    return d.promise;
  };
};