# Narrator

Construct api wrappers around RESTful endpoints.

## Install

```
npm install narrator --save
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

users.create({name: 'frank'}, function (err, response) {
  // User created
});

// OR

users.customMethod():
```

Also, see [Narrator Examples](https://github.com/scottcorgan/narrator/tree/master/examples)


## Api

### Multi-item endpoint

Example:

```javascript
var users = api.endpoint('users');

// users.list();
// users.create();
// users.one();

```

#### list(callback)

#### create(data, callback)

#### one(id)


## Run Tests

```
npm test
```
