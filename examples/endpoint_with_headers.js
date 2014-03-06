var Rapper = require('rapper');

// Instantiate a new Rapper that will all send custom headers
var api = new Rapper({
  host: 'http://somehost.com'
});

api.header('authorization', 'some auth thing');

// Create a new Endpoint
var users =  api.resource('users', {
  customUserMethod: (callback) {
    // Custom logic here
  }
});

// And then, some where else
users.list().then(function (users) {
  // This made a GET request to http://somehost.com/users
  // It was sent with the custom header of "authorization"
  console.log(users);
});