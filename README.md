# Narrator

Construct api wrappers around RESTful endpoints.

## Install

```
npm install narrator --save
```

## Usage

### Endpoints

```
var Narrator = require('narrator');
var narrator = new Narrator({
  host: 'http://someendpoint.com'
});

var SomeEndPoint = narrator.Endpoint('/endpoint', {
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

#### Endpoint Functionality

##### get([callback])
##### getById(id [, callback])
##### create(options [, callback])
##### update(data [, callback])
##### remove(id, [, callback])


## Run Tests

```
npm test
```
