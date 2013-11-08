# Narrator

Build api wrappers around RESTful endpoints. Now compatible with AngularJS and [Browserify](https://github.com/substack/node-browserify)!

## Install

On the server

```
npm install narrator --save
```

In the browser

```
bower install narrator --save
```

## Usage


```javascript
var Narrator = require('narrator');

var api = new Narrator({
  host: 'http://someendpoint.com'
});

// This will construct http://someendpoint.com/endpoint
var users = api.endpoint('users', {
  customMethod: function () {
    // You can have custom functionality
  }
});

users.list(function (err, usersList) {

});

// OR

// With promises
users.create({name: 'frank'}).then(function (response) {
  // User created
});

// OR

users.customMethod();

// AND

var user = users.one(123);
user.get(function (err, userData) {

});
```

Also, see [Narrator Examples](https://github.com/scottcorgan/narrator/tree/master/examples)

## Angular Module

```javascript
angular.module('myApp', ['narrator'])
  .config(function (narratorProvider) {
    narratorProvider.configure({
      host: 'http://someapi.com',
      headers: {}
      // etc. Supports all $http config options
    });
  }).controller('SomeCtrl', function ($scope, narrator) {
    
    $scope.users = narrator.endpoint('users').list();
    
  });
```

## Promises or Callbacks

All methods return a promise or allow you to provide a callback. For example:

```javascript
api.endpoint('users').list().then(function (users) {
  
}, function (err) {
  
});

// OR

api.endpoint('users').list(function (err, users) {
  
});
```


## Multi-item endpoint

Example:

```javascript
var users = api.endpoint('users');

// users.url();
// users.list();
// users.create();
// users.one();
// users.getEndpoint();
```

### url()

Returns the url for the current endpoint

### list(callback)

Performs a ` GET ` request to the api for the given path name

* ` callback ` - gets called with the arguments:
  * **err** - error object if one exists
  * **response** - the response from the server

### create(payload, callback)

Performs a ` POST ` request to the api for the given path name

* ` payload ` - the key-value object to send with the request
* ` callback ` - gets called with the arguments:
  * **err** - error object if one exists
  * **response** - the response from the server

### one(id)

Creates an new single item endpoint with the given id from the mult-item endpoint path. This method returns a new object with the single item methods (see below)

* ` id ` - the id of the single item to create and endpoint form

### getEndpoint(name [, id]);

Gets an endpoint by the endpoint pathname. If the endpoint you're getting is a singular item endpoint with and id, pass the id along.

* ` name ` - the pathname of the endpoint
* ` id ` - the id of the singular resource used when creating the path

## Single-item endpoint

Example:

```javascript
var users = api.endpoint('users');
var user = users.one(123); // Generats /user/123

// user.url();
// user.get();
// user.update();
// user.remove();
// user.endpoint();
// user.getEndpoint();
```

### url()

Returns the url for the current endpoint

### get(callback)

* ` callback ` - gets called with the arguments:
  * **err** - error object if one exists
  * **response** - the response from the server

### update(payload, callback)

* ` payload ` - the key-value object to send with the request
* ` callback ` - gets called with the arguments:
  * **err** - error object if one exists
  * **response** - the response from the server

### remove(callback)

* ` callback ` - gets called with the arguments:
  * **err** - error object if one exists
  * **response** - the response from the server

### endpoint(name, customMethods)

This creates a new endpoint prefixed by the endpoint path that called this method. (i.e ` /users/123/comments `). VERY helpful for creating nested endpoints.

* ` name ` - the name of the endpoing, which is used to build the path (i.e. ` users ` creates the path ` /users `)
* ` customMethods ` - an object contain custom methods to add to the endpoint object

### getEndpoint(name [, id]);

Gets an endpoint by the endpoint pathname. If the endpoint you're getting is a singular item endpoint with and id, pass the id along.

* ` name ` - the pathname of the endpoint
* ` id ` - the id of the singular resource used when creating the path

## Run Tests

```
npm test
```
