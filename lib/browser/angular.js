//
// Prepares Rapper for use in AngularJS
//
angular.module('rapper', [])
  .provider('rapper', function () {
    var Rapper = require('../../index.js');
    
    return {
      _options: {},
      
      configure: function (options) {
        this._options = options;
      },
      
      $get: function ($rootScope, $q, $http, $timeout) {
        var scope = $rootScope.$new();
        var api = new Rapper();
        
        api._request = function (requestOptions) {
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
        
        api.promise = function (callback) {
          var d = $q.defer();
          
          callback(function (data) {
              d.resolve(data);
          }, function (err) {
              d.reject(data);
          });
          
          return d.promise;
        }
        
        return api;
      }
    };
  });