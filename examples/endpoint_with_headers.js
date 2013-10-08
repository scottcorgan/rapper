var Narrator = require('narrator');

// Instantiate a new Narrator that will all send custom headers
var narrator = new Narrator({
  host: 'http://somehost.com',
  headers: {
    authorization: 'some auth thing'
  }
});

// Create a new Endpoint
var Users =  narrator.Endpoint('users', {
  initialize: function () {
    // Do constructor stuff here
  },
  
  customUserMethod: (callback) {
    // Make a GET request to http://somehost.com/users
    // with custom headers
    this._get(function (err, response, users) {
      callback(err, users);
    });
  }
});

var users = new Users();

// And then, some where else

users.getAll(function (err, users) {
  // This made a GET request to http://somehost.com/users
  // It was sent with the custom header of "authorization"
  console.log(users);
});