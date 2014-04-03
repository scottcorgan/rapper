describe('angular service', function () {
  var app;
  var rapperProvider;
  var scope;
  var ctrl;
  var httpMock;
  
  beforeEach(function () {
    app = angular.module('RapperTest', ['rapper']);
    app.config(function (_rapperProvider_) {
      rapperProvider = _rapperProvider_;
    });
    app.controller('TestController', function ($scope, rapper) {
      rapper.host('http://testhost.com');
      var test = rapper.resource('test');
      
      $scope.host = rapper.host();
      $scope.rapper = rapper;
      $scope.test = function () {
        return test.list().then(function (res) {
          $scope.response = res.body;
        });
      };
    });
  });
  
  beforeEach(module('RapperTest'));
  
  beforeEach(inject(function ($rootScope, $controller, rapper, $httpBackend) {
    rapper = rapper;
    scope = $rootScope.$new();
    ctrl = $controller('TestController', {
      '$scope': scope,
      rapper: rapper
    });
    
    httpMock = $httpBackend;
  }));
  
  it('provider can configure the host', function () {
    rapperProvider.configure('http://somehost.com');
    expect(rapperProvider._host).to.equal('http://somehost.com');
  });
  
  it('overwrites the request object with angular $http', function () {
    httpMock.when("GET", "http://testhost.com/test").respond("tested");
    
    return scope.test().then(function (res) {
      httpMock.flush();
      
      expect(res.body).to.equal('tested');
      expect(scope.host).to.equal('http://testhost.com');
      expect(scope.response).to.equal('tested');
    });
  });
  
  it('overwrites the promise method with anguar $q', function () {
    var promise = scope.rapper.promise(function (resolve, reject) {
      resolve('promised');
    });
    
    return promise.then(function (val) {
      expect(val).to.equal('promised');
    });
  });
  
  it('creates a promise from a non promise', function () {
    var promise = scope.rapper.asPromise(123);
    return promise.then(function (val) {
      expect(val).to.equal(123);
    });
  });
  
});