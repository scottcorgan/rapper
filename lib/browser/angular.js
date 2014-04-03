'use strict';

//
// Prepares Rapper for use in AngularJS
//
angular.module('rapper', [])
  .provider('rapper', function () {
    var Rapper = require('../../index.js');
    var angularRequest = require('./angular.request');
    var angularPromise = require('./angular.promise');
    var client;
    
    return {
      _host: null,
      
      configure: function (host) {
        this._host = host;
      },
      
      $get: function ($q, $http) {
        if (!client) {
          client = new Rapper(this._host);
          
          client._makeHttpRequest = angularRequest($http, $q);
          client.promise = angularPromise($q);
        }
        
        return client;
      }
    };
  });