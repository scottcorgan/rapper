var expect = require('chai').expect;
var Narrator = require('../lib/narrator');
var endpoint = require('../lib/endpoint');
var _http = require('../lib/http');
var entity = require('../lib/entity');
var stubServer = require('./stubs/server');

describe('.endpoint', function() {
  beforeEach(function (done) {
    endpoint.host = stubServer.STUB_HOST;
    endpoint.path = '/users';
    stubServer.server.start(done);
  });
  
  afterEach(function (done) {
    delete endpoint.path;
    stubServer.server.stop(done);
  });
  
  it('extends the http object', function () {
    expect(endpoint).to.contain.keys(Object.keys(_http));
  });
  
  it('generates the full request url', function () {
    expect(endpoint.url()).to.equal(stubServer.STUB_HOST + '/users');
  });
  
  it('performs a GET request to the endpoint to retrieve a list', function (done) {
    endpoint.list(function (err, response) {
      expect(response.method).to.equal('GET');
      done();
    });
  });
  
  it('preforms a POST request to the endpoint to create a new resource item', function (done) {
    var body = {
      name: 'frank'
    };
    
    endpoint.create(body, function (err, response) {
      expect(response.method).to.equal('POST');
      expect(response.body).to.eql(body);
      done();
    });
  });
  
  describe('#one()', function () {
    var user;
    
    beforeEach(function () {
      user = endpoint.one('123');
    });
    
    it('extends .entity as a new endpoint', function () {
      expect(user).to.contain.keys(Object.keys(entity));
    });
    
    it('sets the id', function () {
      expect(user.id).to.equal('123');
    });
  });
})