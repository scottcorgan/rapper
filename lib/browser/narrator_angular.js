angular.module('narrator', [])
  .provider('narrator', function () {
    
    var Narrator = require('../narrator');
    var Http = require('../http');
    var asQ = require('./asQ');
    var asHttp = require('./asHttp');
    
    Narrator.prototype._xhr = {};
    
    // Add support for special xhr cases
    Narrator.prototype.withCredentials = function (_withCreds) {
      this.xhr('withCredentials', _withCreds);
      return this;
    };
    
    Narrator.prototype.xhr = function (key, value) {
      this._xhr[key] = value;
      return this;
    };
    
    return {
      _options: {},
      
      configure: function (options) {
        this._options = options;
      },
      
      $get: function ($rootScope, $q, $http) {
        $rootScope.narratorApply = function(fn) {
          var phase = this.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };
        
        asQ(Http, $rootScope, $q);
        asHttp(Http, $http);
        return new Narrator(this._options);
      }
    };
  });