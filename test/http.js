var expect = require('chai').expect;
var Narrator = require('../lib/narrator');
var endpoint = require('../lib/endpoint');
var http = require('../lib/http');
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

describe('http', function () {
  beforeEach(function (done) {
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('sets default headers to empty', function () {
    expect(http.headers).to.eql({});
  });
  
  it('sets the headers manually', function () {
    http.setHeaders(HEADERS);
    expect(http.headers).to.eql(HEADERS);
  });
  
  it('parses JSON or not', function () {
    expect(http._parseJSON('{"key":"value"}')).to.eql({
      key: 'value'
    });
    expect(http._parseJSON('test')).to.equal('test');
  });
  
  it('makes an http request with the given method', function (done) {
    http._http(STUB_HOST, 'GET', {}, function (err, response, body) {
      expect(body.method).to.equal('GET');
      done();
    });
  });
  
  it('makes an http request to the given host', function (done) {
    http._http(STUB_HOST, 'GET', {}, function (err, response, body) {
      expect('http://' + body.headers.host).to.equal(STUB_HOST);
      done();
    });
  });
  
  it('makes an http request with custom headers', function (done) {
    http.setHeaders(HEADERS);
    http._request(STUB_HOST, 'GET', {}, function (err, response, body) {
      expect(body.headers.authorization).to.equal('token');
      done();
    });
  });
  
  it('allows options to be otional for _http', function (done) {
    http._http(STUB_HOST, 'GET', function () {
      done();
    });
  });
  
  it('allows options to be otional for _request', function (done) {
    http._request(STUB_HOST, 'GET', function () {
      done();
    });
  });
});