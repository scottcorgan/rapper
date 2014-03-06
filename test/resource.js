var Rapper = require('../index.js');
var Resource = require('../lib/resource.js');
var Mocksy = require('mocksy');
var expect = require('expect.js');
var PORT = 9999;
var server = new Mocksy({port: PORT});

describe('defining resources', function() {
  var api;
  var resource;
  
  beforeEach(function (done) {
    api = new Rapper();
    api.host('http://localhost:' + PORT);
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('instantiates a resource', function () {
    var resource = new Resource({
      name: 'resource',
      api: api
    });
    
    expect(resource.name).to.equal('resource');
    expect(resource.api).to.eql(api);
  });
  
  it('provides the url', function () {
    var resource = api.resource('resource');
    expect(resource.url()).to.equal('/resource');
  });
  
  it('provides the url with the host', function () {
    var resource = api.resource('resource');
    expect(resource.url(true)).to.equal(resource.api.attributes.host + '/resource');
  });
  
  it('adds custom method', function () {
    var resource = api.resource('resource', {
      finish: function () {
        called = true;
      }
    });
    
    resource.finish();
    expect(called).to.equal(true);
  });
  
  describe('custom xhr fields', function () {
    var resource;
    
    beforeEach(function () {
      resource = api.resource('resource');
    });
    
    it('sets and uses custom xhr fields', function () {
      resource.xhr('withCredentials', true);
      expect(resource.xhr('withCredentials')).to.equal(true);
    });
    
    it('uses the custom xhr fields in GET requests', function (done) {
      resource.xhr('method', 'POST');
      resource.get().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('post');
        done();
      });
    });
    
    it('uses the custom xhr fields in POST requests', function (done) {
      resource.xhr('method', 'GET');
      resource.post({}).then(function (res) {
        expect(res.method.toLowerCase()).to.equal('get');
        done();
      });
    });
    
    it('uses the global custom xhr fields in resource request', function (done) {
      api.xhr('method', 'POST');
      resource.get().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('post');
        done();
      });
    });
    
    it('overrides the global custom xhr fields with resource specific custom xhr fields', function (done) {
      api.xhr('method', 'POST');
      resource.xhr('method', 'PUT');
      resource.get().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('put');
        done();
      });
    });
  });
  
  describe('a resource for a single item', function () {
    var resource;
    
    beforeEach(function () {
      resource = api.resource('resource');
    });
    
    it('defines the single resource with url', function () {
      var single = resource.one(123);
      expect(single.url()).to.equal('/resource/123');
    });
    
    it('gets the single item from the resource', function (done) {
      resource.one(123).get().then(function (res) {
        expect(res.url).to.equal('/resource/123');
        expect(res.method.toLowerCase()).to.equal('get');
        done();
      });
    });
    
    it('updates a single item', function (done) {
      resource.one(123).put({
        name: 'name'
      }).then(function (res) {
        expect(res.url).to.equal('/resource/123');
        expect(res.method.toLowerCase()).to.equal('put');
        expect(res.body.name).to.equal('name');
        done();
      });
    });
    
    it('removes a single item', function (done) {
      resource.one(123).del().then(function (res) {
        expect(res.url).to.equal('/resource/123');
        expect(res.method.toLowerCase()).to.equal('delete');
        done();
      });
    });
    
    describe('aliases', function () {
      it('put with update', function (done) {
        resource.one(123).update({
          name: 'name'
        }).then(function (res) {
          expect(res.url).to.equal('/resource/123');
          expect(res.method.toLowerCase()).to.equal('put');
          expect(res.body.name).to.equal('name');
          done();
        });
      });
      
      it('del with remove', function (done) {
        resource.one(123).remove().then(function (res) {
          expect(res.url).to.equal('/resource/123');
          expect(res.method.toLowerCase()).to.equal('delete');
          done();
        });
      });
    });
    
    it('adds custom method', function () {
      var called = false;
      var single = resource.one(123, {
        finish: function () {
          called = true;
        }
      });
      
      single.finish();
      expect(called).to.equal(true);
    });
    
    describe('custom xhr fields', function () {
      var resource;
      var single
      
      beforeEach(function () {
        resource = api.resource('resource');
        single = resource.one(123);
      });
      
      it('sets and uses custom xhr fields', function () {
        single.xhr('withCredentials', true);
        expect(single.xhr('withCredentials')).to.equal(true);
      });
      
      it('uses the custom xhr fields in GET requests', function (done) {
        single.xhr('method', 'POST');
        single.get().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('post');
          done();
        });
      });
      
      it('uses the custom xhr fields in PUT requests', function (done) {
        single.xhr('method', 'GET');
        single.put({}).then(function (res) {
          expect(res.method.toLowerCase()).to.equal('get');
          done();
        });
      });
      
      it('uses the custom xhr fields in DELETE requests', function (done) {
        single.xhr('method', 'GET');
        single.del().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('get');
          done();
        });
      });
      
      it('uses the global custom xhr fields in resource request', function (done) {
        api.xhr('method', 'POST');
        single.get().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('post');
          done();
        });
      });
      
      it('overrides the global custom xhr fields with resource specific custom xhr fields', function (done) {
        api.xhr('method', 'POST');
        single.xhr('method', 'PUT');
        single.get().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('put');
          done();
        });
      });
    });
  });

  describe('before and after hooks', function () {
    it('runs a queue of functions before it makes the resource request', function (done) {
      var called1 = false;
      var called2 = false;
      var url;
      var resource = api.resource('resource');
      
      resource.before(function (done) {
        called1 = true;
        url = this.url();
        done();
      }, function (done) {
        called2 = true;
        done();
      });
      
      resource.get().then(function () {
        expect(url).to.equal(resource.url());
        expect(called1).to.equal(true);
        expect(called2).to.equal(true);
        done();
      });
    });
    
    it('sends an error to the callback if the before queue gives an error', function (done) {
      var called = false;
      var resource = api.resource('resource');
      resource.before(function (done) {
        done('error');
      }, function (done) {
        called = true;
        done();
      });
      
      resource.get().then(function () {}, function (err) {
        expect(err).to.equal('error');
        expect(called).to.equal(false);
        done();
      });
    });
  });
});

describe('nested resources', function () {
  var api;
  var resource;
  
  beforeEach(function (done) {
    api = new Rapper();
    api.host('http://localhost:' + PORT);
    resource = api.resource('resource');
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('creates a nested resource 2 deep', function (done) {
    var level1 = resource.one(123);
    var level2 = level1.resource('resource2');
    
    expect(level2.url()).to.equal('/resource/123/resource2');
    
    level2.list().then(function (res) {
      expect(res.url).to.equal('/resource/123/resource2');
      expect(res.method.toLowerCase()).to.equal('get');
      done();
    });
  });
  
  it('creates nested single item 2 deep', function () {
    var level1 = resource.one(123);
    var level2 = level1.resource('resource2');
    var level3 = level2.one(456);
    
    expect(level3.url()).to.equal('/resource/123/resource2/456');
  });
  
  it('creats nested resources one after another', function (done) {
    var level1 = resource.resource('resource2');
    
    expect(level1.url()).to.equal('/resource/resource2');
    
    level1.create({
      name: 'name'
    }).then(function (res) {
      expect(res.url).to.equal('/resource/resource2');
      expect(res.method.toLowerCase()).to.equal('post');
      expect(res.body.name).to.equal('name');
      done();
    });
  });
});