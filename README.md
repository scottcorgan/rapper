# Narrator

Construct api wrappers around RESTful endpoints.

## Install

```
npm install narrator --save
```

## Usage

```javascript
var Narrator = require('narrator');
var narrator = new Narrator({
  host: 'http://someendpoint.com'
});

// This will construct http://someendpoint.com/endpoint
var SomeEndPoint = narrator.Endpoint('endpoint', {
  intialize: function (options) {
    // This is the constructor
  },
  
  customMethod: function () {
    // You can have custom functionality
  }
});

var options = {};

module.exports = new SomeEndPoint(options);
```

Also, see [Narrator Examples](https://github.com/scottcorgan/narrator/tree/master/examples)

## Narrator Instance Methods

### _http(path, method [, options, callback])

* ` path ` - the path to add to the end of the host (i.e. ` /path `)
* ` method ` - the http method type of the request (GET, POST, PUT, DELETE)
* ` options ` - optional extras to add to the request, such as headers, form data, etc.
* ` callback ` - callback is passed the arguments:
  * **err** - error object
  * **response** - contains all types of response information
  * **body** - Response from request (stringified)

### _request(path, method [, options, callback])

This method is the same as ` _http `, except that it sends the headers declared on the **Narrator** instance for each request

* ` path ` - the path to add to the end of the host (i.e. ` /path `)
* ` method ` - the http method type of the request (GET, POST, PUT, DELETE)
* ` options ` - optional extras to add to the request, such as headers, form data, etc.
* ` callback ` - callback is passed the arguments:
  * **err** - error object
  * **response** - contains all types of response information
  * **body** - Response from request (stringified)

### setHeaders(headers)

* ` headers ` - an object containing key/value pairs of headers to send on each request

## Endpoint Instance Methods

All **Narrator** instance methods are available on all Endpoint instances

### get([callback])

* ` callback ` - callback is passed the arguments:
  * **err** - error object
  * **response** - Response from request (parsed if JSON)

### getById(id [, callback])

* ` id ` - id passed to endpoint for request
* ` callback ` - callback is passed the arguments:
  * **err** - error object
  * **response** - Response from request (parsed if JSON)

### create(payload [, callback])

* ` payload ` - the payload data to send to the server in the request
* ` callback ` - callback is passed the arguments:
  * **err** - error object
  * **response** - Response from request (parsed if JSON)

### update(id, payload [, callback])

* ` id ` - id of record being updated at the endpoint
* ` payload ` - the payload data to send to the server in the request
* ` callback ` - callback is passed the arguments:
  * **err** - error object
  * **response** - Response from request (parsed if JSON)

### remove(id, [, callback])

* ` id ` - id of record to delete at the endpoint
* ` callback ` - callback is passed the arguments:
  * **err** - error object
  * **response** - Response from request (parsed if JSON)


## Run Tests

```
npm test
```
