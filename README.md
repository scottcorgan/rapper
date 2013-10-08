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

## Narrator Instance Methods

### _http(path, method, options, callback)

## Endpoint Instance Methods

### get([callback])
### getById(id [, callback])
### create(options [, callback])
### update(data [, callback])
### remove(id, [, callback])


## Run Tests

```
npm test
```
