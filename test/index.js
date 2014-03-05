var Rapper = require('../index.js');
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
  
  it('has generic getter/setter methods', function () {
    api._setValue('host', 'somehost.com');
    expect(api._getValue('host')).to.equal('somehost.com');
  });
  
  it('sets and gets the host', function () {
    api.host('somehost.com');
    expect(api.host()).to.equal('somehost.com');
  });
  
  it('sets and gets the headers', function () {
    api.header('content-type', 'text/html');
    expect(api.header('content-type')).to.equal('text/html');
  });
  
  it('provides a promise utility', function (done) {
    var promise = api.promise(function (resolve, reject) {
      resolve('yes');
    });
    
    promise.then(function (res) {
      expect(res).to.equal('yes');
      done();
    });
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
  
  it('overrides with custom options per request', function (done) {
    api.get('/endpoint', {
      method: 'POST'
    }).then(function (res) {
      expect(res.method.toLowerCase()).to.equal('post');
      done();
    }, done);
  });
  
  it('sends the headers with a request', function (done) {
    api.header('authorization', 'asdf');
    api.get('/endpoint').then(function (res) {
      expect(res.headers.authorization).to.equal('asdf');
      done();
    }, done);
  });
  
  it('overrides the headers with options', function (done) {
    api.header('authorization', 'asdf');
    api.get('/endpoint', {
      headers: {
        authorization: 'qwer'
      }
    }).then(function (res) {
      expect(res.headers.authorization).to.equal('qwer');
      done();
    }, done);
  });
  
  describe('request types', function () {
    Rapper._httpMethods.forEach(function (method) {
      it('makes a ' + method + ' request', function (done) {
        
        // i.e. api.get(), api.post(), etc.
        
        api[method.toLowerCase()]('/endpoint').then(function (res) {
          expect(res.method.toLowerCase()).to.equal(method.toLowerCase());
          expect(res.url).to.equal('/endpoint');
          done();
        }, done);
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
  
  it('performs a http request to the resource', function (done) {
    var resource = api.resource('resource');
    resource.get().then(function (res) {
      expect(res.method.toLowerCase()).to.equal('get');
      expect(res.url).to.equal('/resource');
      done();
    });
  });
  
  it('posts a new element on the resource', function (done) {
    var resource = api.resource('resource');
    resource.post({
      name: 'name'
    }).then(function (res) {
      expect(res.method.toLowerCase()).to.equal('post');
      expect(res.body.name).to.equal('name');
      done();
    });
  });
  
  describe('aliases', function () {
    it('aliases get with list', function (done) {
      var resource = api.resource('resource');
      resource.list().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('get');
        expect(res.url).to.equal('/resource');
        done();
      });
    });
    
    it('aliases post with a create', function (done) {
      var resource = api.resource('resource');
      resource.create({
        name: 'name'
      }).then(function (res) {
        expect(res.method.toLowerCase()).to.equal('post');
        expect(res.body.name).to.equal('name');
        done();
      });
    });
  });
});