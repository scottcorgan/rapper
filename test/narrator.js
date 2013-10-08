var expect = require('chai').expect;
var Narrator = require('../lib/narrator');
var endpoint = require('../lib/endpoint');
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

describe('Narrator', function () {
  var api;
  
  beforeEach(function () {
    api = new Narrator(narratorOptions);
  });
  
  describe('#Narrator()', function () {
    it('instantiates Narrator with a host', function () {
      expect(api.host).to.equal(STUB_HOST);
    });
    
    it('instantiates with optional headers', function () {
      expect(api.headers).to.equal(HEADERS);
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
      server.start(done);
    });
    
    afterEach(function (done) {
      server.stop(done);
    });
    
    it('creates a new endpoint with given path', function () {
      expect(users.path).to.equal('/users');
    });
    
    it('extends functionaly with custom method declarations', function () {
      expect(users.customMethod.toString()).to.equal(customMethod.toString());
    });
    
    // it('gets all from an endpoint', function (done) {
    //   users.list(function (err, list) {
    //     expect(err).to.equal(null);
    //     done();
    //   });
    // });
    
    // it('creats a new resource from the endpoint', function () {
    //   users.create({
    //     name: 'frank'
    //   }, function (err, response) {
    //     expect(err).to.equal(null);
    //     done();
    //   });
    // });
  });
});