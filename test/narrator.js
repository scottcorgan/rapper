var expect = require('chai').expect;
var Narrator = require('../lib/narrator');
var endpoint = require('../lib/endpoint');
var stubServer = require('./stubs/server');
var narratorOptions = {
  host: stubServer.STUB_HOST,
  headers: stubServer.HEADERS
};

describe('#Narrator()', function () {
  
  beforeEach(function () {
    this.api = new Narrator(narratorOptions);
  });
  
  it('instantiates Narrator with an _endpoints collection', function () {
    expect(this.api._endpoints).to.eql({});
  });
  
  it('instantiates Narrator with a host', function () {
    expect(this.api.host).to.equal(stubServer.STUB_HOST);
  });
  
  it('instantiates with optional headers', function () {
    expect(this.api.headers).to.equal(stubServer.HEADERS);
  });
  
  it('returns the endpoint if it is already declared', function () {
    var users = this.api.endpoint('users', {
      customMethod: function () {}
    });
    var usersEndpoint = this.api.endpoint('users');
    
    expect(usersEndpoint).to.eql(users);
  });
  
  describe('#endpoint()', function () {
    
    beforeEach(function (done) {
      this.customMethod = function () { return 'ya!'; };
      this.users = this.api.endpoint('users', { customMethod: this.customMethod });
      stubServer.server.start(done);
    });
    
    afterEach(function (done) {
      stubServer.server.stop(done);
    });
    
    it('creates a new endpoint with given path', function () {
      expect(this.users.options.path).to.equal('/users');
    });
    
    it('creates a new endpoint with the given _endpoints', function () {
      expect(this.users.options._endpoints).to.be.ok;
    });
    
    it('extends functionaly with custom method declarations', function () {
      expect(this.users.customMethod.toString()).to.equal(this.customMethod.toString());
    });
    
    it('gets all from an endpoint', function (done) {
      this.users.list(function (err, list) {
        expect(err).to.equal(null);
        done();
      });
    });
  });
});