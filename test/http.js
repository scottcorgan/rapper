var expect = require('chai').expect;
var Narrator = require('../lib/narrator');
var endpoint = require('../lib/endpoint');
var http = require('../lib/http');
var stubServer = require('./stubs/server');

describe('http', function () {
  beforeEach(function (done) {
    stubServer.server.start(done);
  });
  
  afterEach(function (done) {
    stubServer.server.stop(done);
  });
  
  it('sets default headers to empty', function () {
    expect(http.headers).to.eql({});
  });
  
  it('sets the headers manually', function () {
    http.setHeaders(stubServer.HEADERS);
    expect(http.headers).to.eql(stubServer.HEADERS);
  });
  
  it('parses JSON or not', function () {
    expect(http._parseJSON('{"key":"value"}')).to.eql({
      key: 'value'
    });
    expect(http._parseJSON('test')).to.equal('test');
  });
  
  it('makes an http request with the given method', function (done) {
    http._http(stubServer.STUB_HOST, 'GET', {}, function (err, response, body) {
      expect(body.method).to.equal('GET');
      done();
    });
  });
  
  it('makes an http request to the given host', function (done) {
    http._http(stubServer.STUB_HOST, 'GET', {}, function (err, response, body) {
      expect('http://' + body.headers.host).to.equal(stubServer.STUB_HOST);
      done();
    });
  });
  
  it('makes an http request with custom headers', function (done) {
    http.setHeaders(stubServer.HEADERS);
    http.request(stubServer.STUB_HOST, 'GET', {}, function (err, response, body) {
      expect(body.headers.authorization).to.equal('token');
      done();
    });
  });
  
  it('allows options to be otional for _http', function (done) {
    http._http(stubServer.STUB_HOST, 'GET', function () {
      done();
    });
  });
  
  it('allows options to be otional for request', function (done) {
    http.request(stubServer.STUB_HOST, 'GET', function () {
      done();
    });
  });
  
  it('executes the pre hook if defined', function (done) {
    var preHookCalled = false;
    
    http.pre = function (endpoint, next) {
      preHookCalled = true;
      next();
    };
    
    http.request(stubServer.STUB_HOST, 'GET', function () {
      expect(preHookCalled).to.be.ok;
      done();
    });
  });
});