var expect = require('chai').expect;
var Narrator = require('../lib/narrator');
var endpoint = require('../lib/endpoint');
var stubServer = require('./stubs/server');
var narratorOptions = {
  host: stubServer.STUB_HOST,
  headers: stubServer.HEADERS
};

describe('Narrator', function () {
  var api;
  
  beforeEach(function () {
    api = new Narrator(narratorOptions);
  });
  
  describe('#Narrator()', function () {
    it('instantiates Narrator with a host', function () {
      expect(api.host).to.equal(stubServer.STUB_HOST);
    });
    
    it('instantiates with optional headers', function () {
      expect(api.headers).to.equal(stubServer.HEADERS);
    });
  });
  
  describe('#endpoint() as a factory', function () {
    var users;
    var customMethod = function () {
      return 'ya!';
    };
    
    beforeEach(function (done) {
      users = api.endpoint('users', {
        customMethod: customMethod
      });
      stubServer.server.start(done);
    });
    
    afterEach(function (done) {
      stubServer.server.stop(done);
    });
    
    it('creates a new endpoint with given path', function () {
      expect(users.path).to.equal('/users');
    });
    
    it('extends functionaly with custom method declarations', function () {
      expect(users.customMethod.toString()).to.equal(customMethod.toString());
    });
    
    it('gets all from an endpoint', function (done) {
      users.list(function (err, list) {
        expect(err).to.equal(null);
        done();
      });
    });
    
    it('creats a new resource from the endpoint', function () {
      users.create({
        name: 'frank'
      }, function (err, response) {
        expect(err).to.equal(null);
        done();
      });
    });
  });
});