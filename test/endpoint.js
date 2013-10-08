var expect = require('chai').expect;
var Narrator = require('../lib/narrator');
var endpoint = require('../lib/endpoint');
var _http = require('../lib/http');
var entity = require('../lib/entity');
var Mocksy = require('mocksy');
var PORT = 4756;
var STUB_HOST = 'http://localhost:' + PORT;
var server = new Mocksy({port: PORT});
var HEADERS = {
  authorization: 'token'
};
var narratorOptions = {
  host: STUB_HOST,
  headers: HEADERS
};

describe('.endpoint', function() {
  beforeEach(function (done) {
    endpoint.host = STUB_HOST;
    endpoint.path = '/users';
    server.start(done);
  });
  
  afterEach(function (done) {
    delete endpoint.path;
    server.stop(done);
  });
  
  it('extends the http object', function () {
    expect(endpoint).to.contain.keys(Object.keys(_http));
  });
  
  it('generates the full request url', function () {
    expect(endpoint.url()).to.equal(STUB_HOST + '/users');
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
  });
})