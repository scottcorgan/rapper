var expect = require('chai').expect;
var Http = require('../lib/http');
var stubServer = require('./stubs/server');

describe('#Http()', function () {
  
  beforeEach(function (done) {
    this.http = new Http();
    stubServer.server.start(done);
  });
  
  afterEach(function (done) {
    stubServer.server.stop(done);
  });
  
  it('sets defaults to avoid undefined errors', function () {
    var http = new Http();
    expect(http.options).to.contain.keys(['headers', 'hooks', 'context']);
  });
  
  it('overrides the defaults', function () {
    var http = new Http({
      context: 'context',
      headers: 'headers',
      hooks: 'hooks'
    });
    
    expect(http.options.context).to.equal('context');
    expect(http.options.headers).to.equal('headers');
    expect(http.options.hooks).to.equal('hooks');
  });
  
  it('manually sets the headers', function () {
    this.http.setHeaders({
      key: 'value'
    });
    
    expect(this.http.options.headers).to.eql({
      key: 'value'
    });
  });
  
  it('adds an individual header', function () {
    this.http.setHeader('header', 'headerValue');
    expect(this.http.options.headers.header).to.equal('headerValue');
  });
  
  it('removes an individual header', function () {
    this.http.setHeader('header', 'headerValue');
    expect(this.http.options.headers.header).to.equal('headerValue');
    this.http.removeHeader('header');
    expect(this.http.options.headers.header).to.not.be.defined;
  });
  
  it('parses JSON or not', function () {
    expect(this.http._parseJSON('{"key":"value"}')).to.eql({
      key: 'value'
    });
    expect(this.http._parseJSON('test')).to.equal('test');
  });
  
  it('makes an http request with the given method', function (done) {
    this.http._http(stubServer.STUB_HOST, 'GET', {}, function (err, response, body) {
      expect(body.method).to.equal('GET');
      done();
    });
  });
  
  it('makes an http request to the given host', function (done) {
    this.http._http(stubServer.STUB_HOST, 'GET', {}, function (err, response, body) {
      expect('http://' + body.headers.host).to.equal(stubServer.STUB_HOST);
      done();
    });
  });
  
  it('makes an http request with custom headers', function (done) {
    this.http.setHeaders(stubServer.HEADERS);
    this.http.request(stubServer.STUB_HOST, 'GET', {}, function (err, response, body) {
      expect(body.headers.authorization).to.equal('token');
      done();
    });
  });
  
  it('returns a promise when making a raw request', function () {
    var promise = this.http._http(stubServer.STUB_HOST, 'GET');
    expect(promise).to.have.key('then');
  });
  
  it('returns a promise when making a request', function () {
    var promise = this.http.request(stubServer.STUB_HOST, 'GET');
    expect(promise).to.have.key('then');
  });
  
  it('allows options to be options for #_http()', function (done) {
    this.http._http(stubServer.STUB_HOST, 'GET', function () {
      done();
    });
  });
  
  it('allows options to be options for #request()', function (done) {
    this.http.request(stubServer.STUB_HOST, 'GET', function () {
      done();
    });
  });
  
  it('executes the pre hook if defined', function (done) {
    var preHookCalled = false;
    
    this.http.options.hooks.pre = function (next) {
      preHookCalled = true;
      next();
    };
    
    this.http.request(stubServer.STUB_HOST, 'GET', function () {
      expect(preHookCalled).to.be.ok;
      done();
    });
  });
});