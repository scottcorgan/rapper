var Rapper = require('../../index.js');
var Resource = require('../../lib/resource.js');
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
      resource.xhrOption('withCredentials', true);
      expect(resource.xhrOption('withCredentials')).to.equal(true);
    });
    
    it('uses the custom xhr fields in GET requests', function () {
      resource.xhrOption('method', 'POST');
      
      return resource.get().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('post');
      });
    });
    
    it('uses the custom xhr fields in POST requests', function () {
      resource.xhrOption('method', 'GET');
      
      return resource.post({}).then(function (res) {
        expect(res.method.toLowerCase()).to.equal('get');
      });
    });
    
    it('uses the global custom xhr fields in resource request', function () {
      api.xhrOption('method', 'POST');
      
      return resource.get().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('post');
      });
    });
    
    it('overrides the global custom xhr fields with resource specific custom xhr fields', function () {
      api.xhrOption('method', 'POST');
      resource.xhrOption('method', 'PUT');
      
      return resource.get().then(function (res) {
        expect(res.method.toLowerCase()).to.equal('put');
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
    
    it('gets the single item from the resource', function () {
      return resource.one(123).get().then(function (res) {
        expect(res.url).to.equal('/resource/123');
        expect(res.method.toLowerCase()).to.equal('get');
      });
    });
    
    it('updates a single item', function () {
      return resource.one(123).put({
        name: 'name'
      }).then(function (res) {
        expect(res.url).to.equal('/resource/123');
        expect(res.method.toLowerCase()).to.equal('put');
        expect(res.body.name).to.equal('name');
      });
    });
    
    it('removes a single item', function () {
      return resource.one(123).del().then(function (res) {
        expect(res.url).to.equal('/resource/123');
        expect(res.method.toLowerCase()).to.equal('delete');
      });
    });
    
    describe('aliases', function () {
      it('put with update', function () {
        return resource.one(123).update({
          name: 'name'
        }).then(function (res) {
          expect(res.url).to.equal('/resource/123');
          expect(res.method.toLowerCase()).to.equal('put');
          expect(res.body.name).to.equal('name');
        });
      });
      
      it('del with remove', function () {
        return resource.one(123).remove().then(function (res) {
          expect(res.url).to.equal('/resource/123');
          expect(res.method.toLowerCase()).to.equal('delete');
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
        single.xhrOption('withCredentials', true);
        expect(single.xhrOption('withCredentials')).to.equal(true);
      });
      
      it('uses the custom xhr fields in GET requests', function () {
        single.xhrOption('method', 'POST');
        
        return single.get().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('post');
        });
      });
      
      it('uses the custom xhr fields in PUT requests', function () {
        single.xhrOption('method', 'GET');
        
        return single.put({}).then(function (res) {
          expect(res.method.toLowerCase()).to.equal('get');
        });
      });
      
      it('uses the custom xhr fields in DELETE requests', function () {
        single.xhrOption('method', 'GET');
        
        return single.del().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('get');
        });
      });
      
      it('uses the global custom xhr fields in resource request', function () {
        api.xhrOption('method', 'POST');
        
        return single.get().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('post');
        });
      });
      
      it('overrides the global custom xhr fields with resource specific custom xhr fields', function () {
        api.xhrOption('method', 'POST');
        single.xhrOption('method', 'PUT');
        
        return single.get().then(function (res) {
          expect(res.method.toLowerCase()).to.equal('put');
        });
      });
    });
  });

  describe('before and after hooks', function () {
    it('runs a queue of functions before it makes the resource request', function () {
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
      
      return resource.get().then(function () {
        expect(url).to.equal(resource.url());
        expect(called1).to.equal(true);
        expect(called2).to.equal(true);
      });
    });
    
    it('sends an error to the callback if the before queue gives an error', function () {
      var called = false;
      var resource = api.resource('resource');
      resource.before(function (done) {
        done('error');
      }, function (done) {
        called = true;
        done();
      });
      
      return resource.get().then(function () {}, function (err) {
        expect(err).to.equal('error');
        expect(called).to.equal(false);
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
  
  it('creates a nested resource 2 deep', function () {
    var level1 = resource.one(123);
    var level2 = level1.resource('resource2');
    
    expect(level2.url()).to.equal('/resource/123/resource2');
    
    return level2.list().then(function (res) {
      expect(res.url).to.equal('/resource/123/resource2');
      expect(res.method.toLowerCase()).to.equal('get');
    });
  });
  
  it('creates nested single item 2 deep', function () {
    var level1 = resource.one(123);
    var level2 = level1.resource('resource2');
    var level3 = level2.one(456);
    
    expect(level3.url()).to.equal('/resource/123/resource2/456');
  });
  
  it('creats nested resources one after another', function () {
    var level1 = resource.resource('resource2');
    
    expect(level1.url()).to.equal('/resource/resource2');
    
    return level1.create({
      name: 'name'
    }).then(function (res) {
      expect(res.url).to.equal('/resource/resource2');
      expect(res.method.toLowerCase()).to.equal('post');
      expect(res.body.name).to.equal('name');
    });
  });
  
  it('aliases a method with another name', function () {
    resource.alias('one', 'id');
    var withId = resource.id(123);
    expect(withId.url()).to.equal('/resource/123');
  });
  
  
  describe('params', function () {
    
    it('gets the params', function () {
      resource.param('key1', 'value1');
      expect(resource.params()).to.eql({key1: 'value1'});
    });
    
    it('gets a single param value', function () {
      resource.param('key1', 'value1');
      expect(resource.param('key1')).to.equal('value1');
    });
    
    it('sets params with an object', function () {
      resource.param('key1', 'value1');
      resource.param('key2', 'value2');
      resource.params({
        key3: 'value3'
      });
      
      expect(resource.params()).to.eql({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
      });
    });
    
    it('adds parameters to the resource url', function () {
      resource.param('key1', 'value1');
      resource.param('key2', 'value2');
      expect(resource.url()).to.equal('/resource?key1=value1&key2=value2');
    });
    
  });
  
});