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
    })
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