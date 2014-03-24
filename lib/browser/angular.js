'use strict';

//
// Prepares Rapper for use in AngularJS
//
angular.module('rapper', [])
  .provider('rapper', function () {
    var Rapper = require('../../index.js');
    var angularRequest = require('./angular.request');
    var angularPromise = require('./angular.promise');
    
    return {
      _host: {},
      
      configure: function (host) {
        this._host = host;
      },
      
      $get: function ($q, $http) {
        var api = new Rapper(this._host);
        
        api._request = angularRequest($http, $q);
        api.promise = angularPromise($q);
        
        return api;
      }
    };
  });