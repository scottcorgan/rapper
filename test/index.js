var expect = require('chai').expect;
var Mocksy = require('mocksy');
var Narrator = require('../');

var PORT = 9387;
var STUB_HOST = 'http://localhost:' + PORT;
var server = new Mocksy({port: PORT});

describe('Narrator', function () {
  beforeEach(function (done) {
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('creates an instance of Narrator', function () {
    expect(Narrator.create({}) instanceof Narrator).to.be.ok;
  });
  
  describe('#endpoint()', function() {
    var narrator;
    var Endpoint;
    var intializer = function () {};
    
    beforeEach(function () {
      narrator = Narrator.create({
        host: STUB_HOST
      });
      
      Endpoint = narrator.Endpoint('endpoint', {
        initialize: intializer,
        someMethod: function () {}
      });
    });
    
    afterEach(function () {
      narrator = null;
      Endpoint = null;
    });
    
    it('automagially sets the path', function () {
      expect(Endpoint.prototype.path).to.equal('/endpoint');
    });
    
    it('sets the prototype from the object definition', function () {
      expect(Endpoint.prototype.someMethod).to.be.a('function');
    });
    
    it('uses the intialize method as the constructor', function () {
      expect(Endpoint.toString()).to.equal(intializer.toString());
    });
    
    it('extends the Narrator prototype', function () {
      var endpoint = new Endpoint();
      expect(endpoint.host).to.equal(STUB_HOST);
    });
    
    describe('#_http()', function () {
      var endpoint;
      
      beforeEach(function () {
        endpoint = new Endpoint();
      });
      
      it('makes an http request from the given parameters', function (done) {
        endpoint._http('/endpoint', 'GET', {}, function (err, response, body) {
          expect(body.method).to.equal('GET');
          expect(body.url).to.equal('/endpoint');
          done();
        });
      });
      
      it('passes options in the request in an http request', function (done) {
        endpoint._http('/endpoint', 'GET', {
          headers: {
            authorization: 'something'
          }
        }, function (err, response, body) {
          expect(body.headers.authorization).to.be.ok;
          done();
        })
      });
    });
    
    describe('#_parseJSON()', function() {
      it('parses JSON or not', function () {
        var endpoint = new Endpoint();
        expect(endpoint._parseJSON('{"key":"value"}')).to.eql({
          key: 'value'
        });
      });
    });
    
    describe('RESTful methods', function() {
      var endpoint;
      
      beforeEach(function () {
        endpoint = new Endpoint();
      });
      
      it('performs a GET request', function (done) {
        endpoint._get({}, function (err, response, body) {
          expect(body.method).to.equal('GET');
          done();
        });
      });
      
      it('performs a GET request by id', function (done) {
        endpoint._getById('id', {}, function (err, response, body) {
          expect(body.method).to.equal('GET');
          expect(body.url).to.equal('/endpoint/id');
          done();
        });
      });
      
      it('performs a POST request', function (done) {
        endpoint._post({}, function (err, response, body) {
          expect(body.method).to.equal('POST');
          done();
        });
      });
      
      it('performs a PUT request by id', function (done) {
        endpoint._put('id', {}, function (err, response, body) {
          expect(body.method).to.equal('PUT');
          expect(body.url).to.equal('/endpoint/id');
          done();
        });
      });
      
      it('performs a DELETE request by id', function (done) {
        endpoint._del('id', {}, function (err, response, body) {
          expect(body.method).to.equal('DELETE');
          expect(body.url).to.equal('/endpoint/id');
          done();
        });
      });
    });
    
    describe('Deafault api calls', function() {
      var endpoint;
      
      beforeEach(function () {
        endpoint = new Endpoint();
      });
      
      it('gets a list of all items', function (done) {
        endpoint.getAll(function (err, items) {
          expect(items.method).to.equal('GET');
          expect(items.url).to.equal('/endpoint');
          done();
        });
      });
      
      it('gets an item by the id', function (done) {
        endpoint.getById('id', function (err, items) {
          expect(items.method).to.equal('GET');
          expect(items.url).to.equal('/endpoint/id');
          done();
        });
      });
      
      it('creates and item with a payload', function (done) {
        endpoint.create({
          email: 'asdf@asdf.com'
        }, function (err, response) {
          expect(response.method).to.equal('POST');
          expect(response.body).to.eql({
            email: 'asdf@asdf.com'
          });
          done();
        });
      });
    });
  });
});