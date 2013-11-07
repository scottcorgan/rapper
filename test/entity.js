var expect = require('chai').expect;
var Entity = require('../lib/entity');
var Http = require('../lib/http');
var stubServer = require('./stubs/server');

describe('#Entity()', function () {
  
  beforeEach(function (done) {
    this.entity = new Entity({
      host: stubServer.STUB_HOST,
      path: '/users',
      id: 123,
      headers: stubServer.HEADERS
    });
    
    stubServer.server.start(done);
  });
  
  afterEach(function (done) {
    stubServer.server.stop(done);
  });
  
  it('sets required defaults', function () {
    expect(this.entity.options).to.contain.keys(['host', 'path', 'headers', '_endpoints']);
  });
  
  it('generates the url for the http request', function () {
    expect(this.entity.url()).to.equal(stubServer.STUB_HOST + '/users/123');
  });
  
  it('gets the resource data for the current single endpoing', function (done) {
    this.entity.get(function (err, data) {
      expect(err).to.equal(null);
      expect(data.method).to.equal('GET');
      done();
    });
  });
  
  it('returns a promise when getting an item', function () {
    expect(this.entity.get()).to.have.key('then');
  });
  
  it('udpates the current resource', function (done) {
    this.entity.update({ name: 'olga' }, function (err, response) {
      expect(err).to.equal(null);
      expect(response.method).to.equal('PUT');
      expect(response.body).to.eql({ name: 'olga' });
      done();
    });
  });
  
  it('returns a promise when updating an item', function () {
    expect(this.entity.update()).to.have.key('then');
  });
  
  it('performs a DELETE request to remove the current resource', function (done) {
    this.entity.remove(function (err, response) {
      expect(err).to.equal(null);
      expect(response.method).to.equal('DELETE');
      done();
    });
  });
  
  it('returns a promise when you remove an item', function () {
    expect(this.entity.remove()).to.have.key('then');
  });
  
  it('gets an endpoint by the path', function () {
    var entity = new Entity({
      _endpoints: {
        test: 'endpoint'
      }
    });
    
    var testEndpoint = entity.getEndpoint('test');
    expect(testEndpoint).to.equal('endpoint');
  });
  
  it('sets up a default pre hook', function () {
    var entity = new Entity();
    expect(entity.hooks.pre).to.be.ok;
  });
  
  it('has an instance of Http', function () {
    expect(this.entity.http instanceof Http).to.be.ok;
  });
  
  describe('#endpoint()', function () {
    
    beforeEach(function () {
      this.subEntity = this.entity.endpoint('subEntity');
    });
    
    it('creates a nested endpoint', function () {
      expect(this.subEntity.url()).to.equal(this.entity.url() + '/subEntity');
      expect(this.subEntity.options.headers).to.eql(stubServer.HEADERS);
    });
    
    it('creates a singular resource endpoing', function () {
      var singleSubEntity = this.subEntity.one(456);
      expect(singleSubEntity.url()).to.equal(this.entity.url() + '/subEntity/456');
    });
    
    it('handles infinitely nested routes', function () {
      var singleSubEntity = this.subEntity.one(456);
      var subSingleSubEntity = singleSubEntity.endpoint('subSingleSubEntity');
      
      expect(subSingleSubEntity.url()).to.equal(singleSubEntity.url() + '/subSingleSubEntity');
    });
    
  });
});