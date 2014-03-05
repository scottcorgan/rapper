module.exports = function (Http, $rootScope, $q) {
  Http.prototype._promiseWrap = function (callback) {
    var d = $q.defer();
    
    callback(function (data) {
      $rootScope.narratorApply(function () {
        d.resolve(data);
      });
    }, function (err) {
      $rootScope.narratorApply(function () {
        d.reject(err);
      });
    });
    
    return d.promise;
  };
};