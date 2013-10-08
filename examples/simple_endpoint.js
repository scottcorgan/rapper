var Narrator = require('narrator');

// Instantiate a new Narrator
var narrator = new Narrator({
  host: 'http://somehost.com'
});

// Create a new Endpoint
var Users =  narrator.Endpoint('users', {
  initialize: function () {
    // Do constructor stuff here
  },
  
  customUserMethod: (callback) {
    // Make a GET request to http://somehost.com/users
    this._get(function (err, response, users) {
      callback(err, users);
    });
  }
});

var users = new Users();

// And then, some where else

users.getAll(function (err, users) {
  console.log(users);
});