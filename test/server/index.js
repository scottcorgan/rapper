var Rapper = require('../../index.js');
var Mocksy = require('mocksy');
var expect = require('expect.js');
var PORT = 9999;
var server = new Mocksy({port: PORT});

describe('Api wrapper set up', function () {
  var api;
  
  beforeEach(function (done) {
    api = new Rapper();
    done();
  });
  
  it('sets and gets the host', function () {
    api.host('somehost.com');
    expect(api.host()).to.equal('somehost.com');
  });
  
  it('sets and gets the headers', function () {
    api.header('content-type', 'text/html');
    expect(api.header('content-type')).to.equal('text/html');
  });
  
  it('provides a promise utility', function () {
    var promise = api.promise(function (resolve, reject) {
      resolve('yes');
    });
    
    return promise.then(function (res) {
      expect(res).to.equal('yes');
    });
  });
  
  it('wraps a value and returns it as a promise', function () {
    var promise = api.asPromise(123);
    return promise.then(function (num) {
      expect(num).to.equal(123);
    });
  });
  
  it('sets the host on instantiation', function () {
    var api = new Rapper('http://localhost:9999');
    expect(api.host()).to.equal('http://localhost:9999');
  });
});

describe('basic http requests', function () {
  var api;
  
  beforeEach(function (done) {
    api = new Rapper();
    api.host('http://localhost:' + PORT);
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('overrides with custom options per request', function () {
    return api.get('/endpoint', {
      method: 'POST'
    }).then(function (res) {
      expect(res.method.toLowerCase()).to.equal('post');
    });
  });
  
  it('sends the headers with a request', function () {
    api.header('authorization', 'asdf');
    
    return api.get('/endpoint').then(function (res) {
      expect(res.headers.authorization).to.equal('asdf');
    });
  });
  
  it('overrides the headers with options', function () {
    api.header('authorization', 'asdf');
    
    return api.get('/endpoint', {
      headers: {
        authorization: 'qwer'
      }
    }).then(function (res) {
      expect(res.headers.authorization).to.equal('qwer');
    });
  });
  
  it('accepts a resource object or a string when building the url', function () {
    var resource = api.resource('resource');
    var stringUrl = api._buildUrl('/test');
    var resourceUrl = api._buildUrl(resource);
    
    expect(stringUrl).to.equal('/test');
    expect(resourceUrl).to.equal('/resource');
  });
  
  describe('request types', function () {
    Rapper.httpMethods.forEach(function (method) {
      it('makes a ' + method + ' request', function () {
        
        // i.e. api.get(), api.post(), etc.
        
        return api[method.toLowerCase()]('/endpoint').then(function (res) {
          expect(res.method.toLowerCase()).to.equal(method.toLowerCase());
          expect(res.url).to.equal('/endpoint');
        });
      });
    });
  });
  
  describe('global custom xhr fields', function () {
    it('sets and uses custom xhr fields', function () {
      api.xhrOption('withCredentials', true);
      expect(api.xhrOption('withCredentials')).to.equal(true);
    });
    
    it('uses the custom xhr fields in https requests', function () {
      api.xhrOption('method', 'POST');
      
      return api.get('/test').then(function (res) {
        expect(res.method.toLowerCase()).to.equal('post');
      });
    });
  });
});

describe('defining a resource', function () {
  var api;
  var host = 'http://localhost:' + PORT;
  
  beforeEach(function (done) {
    api = new Rapper();
    api.host(host);
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('creates a new resource', function () {
    var resource = api.resource('resource');
    expect(resource).to.not.equal(undefined);
  });
  
  it('collects the created resource', function () {
    var resource = api.resource('resource');
    expect(api.resources['/resource']).to.eql(resource);
  });
  
  it('collects nested resources in the api', function () {
    var resource = api.resource('resource');
    var nested = resource.resource('resource2');
    expect(api.resources['/resource/resource2']).to.eql(nested);
  });
  
  it('collects nested single resource in the api', function () {
    var resource = api.resource('resource');
    var nested = resource.one(123);
    expect(api.resources['/resource/123']).to.eql(nested);
  });
  
  it('returns the current resource if it is already defined', function () {
    var r1 = api.resource('resource');
    var r2 = api.resource('resource');
    r1.xhrOption('method', 'POST');
    expect(r1.xhrOptions).to.eql(r2.xhrOptions);
  });
  
  it('returns the current nested single resource if it is already defined', function () {
    var r1 = api.resource('resource');
    var nested1 = r1.one(123);
    var nested2 = r1.one(123);
    nested1.xhrOption('method', 'POST');
    expect(nested1.xhrOptions).to.eql(nested2.xhrOptions);
  });
  
  it('returns the current nested single resource if it is already defined', function () {
    var r1 = api.resource('resource');
    var nested1 = r1.resource('resource1');
    var nested2 = r1.resource('resource1');
    nested1.xhrOption('method', 'POST');
    expect(nested1.xhrOptions).to.eql(nested2.xhrOptions);
  });
  
  it('performs a http request to the resource', function () {
    var resource = api.resource('resource');
    
    return resource.get().then(function (res) {
      expect(res.method.toLowerCase()).to.equal('get');
      expect(res.url).to.equal('/resource');
    });
  });
  
  it('posts a new element on the resource', function () {
    var resource = api.resource('resource');
    
    return resource.post({
      name: 'name'
    }).then(function (res) {
      expect(res.method.toLowerCase()).to.equal('post');
      expect(res.body.name).to.equal('name');
    });
  });
  
  describe('aliases', function () {
    it('aliases get with list', function () {
      var resource = api.resource('resource');
      
      return resource.list().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('get');
        expect(res.url).to.equal('/resource');
      });
    });
    
    it('aliases post with a create', function () {
      var resource = api.resource('resource');
      
      return resource.create({
        name: 'name'
      }).then(function (res) {
        expect(res.method.toLowerCase()).to.equal('post');
        expect(res.body.name).to.equal('name');
      });
    });
  });
  
});