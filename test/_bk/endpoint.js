var expect = require('chai').expect;
var Endpoint = require('../lib/endpoint');
var Entity = require('../lib/entity');
var Http = require('../lib/http');
var stubServer = require('./stubs/server');
var Narrator = require('../lib/narrator');

describe('#Endpoint()', function () {
  
  beforeEach(function (done) {
    this.path = '/endpoint';
    this.endpoint = new Endpoint({
      host: stubServer.STUB_HOST,
      path: '/endpoint',
      headers: stubServer.HEADERS,
      api: new Narrator()
    });
    
    stubServer.server.start(done);
  });
  
  afterEach(function (done) {
    stubServer.server.stop(done);
  });
  
  it('generates the url for the http request', function () {
    expect(this.endpoint.url()).to.equal(stubServer.STUB_HOST + this.path);
  });
  
  it('performs a GET request to the endpoint to retrieve a list', function (done) {
    this.endpoint.list(function (err, response) {
      expect(response.method).to.equal('GET');
      done();
    });
  });
  
  it('returns a promise when listing an endpoing', function () {
    expect(this.endpoint.list()).to.have.key('then');
  });
  
  it('preforms a POST request to the endpoint to create a new resource item', function (done) {
    var body = {
      name: 'frank'
    };
    
    this.endpoint.create(body, function (err, response) {
      expect(response.method).to.equal('POST');
      expect(response.body).to.eql(body);
      done();
    });
  });
  
  it('returns a promise when creating a new itme', function () {
    expect(this.endpoint.create()).to.have.key('then');
  });
  
  it('has an instance of Http', function () {
    expect(this.endpoint.http instanceof Http).to.be.ok;
  });
  
  it('sets up a default pre hook', function () {
    var endpoint = new Endpoint({
      api: new Narrator()
    });
    expect(endpoint.hooks.pre).to.be.ok;
  });
  
  it('gets an endpoint by the path', function () {
    var endpoint = new Endpoint({
      _endpoints: {
        test: 'endpoint'
      },
      api: new Narrator()
    });
    
    var testEndpoint = endpoint.getEndpoint('test');
    expect(testEndpoint).to.equal('endpoint');
  });
  
  describe('#one()', function () {
    beforeEach(function () {
      this.id = 123;
      this.subEndpoint = this.endpoint.one(this.id);
    });
    
    it('extends #Entity() as a new endpoint', function () {
      expect(this.subEndpoint instanceof Entity).to.be.ok;
    });
    
    it('sets the id', function () {
      expect(this.subEndpoint.options.id).to.equal(this.id);
    });
    
    it('passes the headers', function () {
      expect(this.subEndpoint.options.headers).to.eql(stubServer.HEADERS);
    });
    
    // TODO: implement this
    // it.skip('passes #endpoint()', function () {
    //   expect(this.subEndpoint.endpoint).to.be.ok;
    // });
  });
});