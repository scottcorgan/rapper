var Narrator = require('narrator');

// Instantiate a new Narrator that will all send custom headers
var api = new Narrator({
  host: 'http://somehost.com',
  headers: {
    authorization: 'some auth thing'
  }
});

// Create a new Endpoint
var users =  api.endpoint('users', {
  customUserMethod: (callback) {
    // Custom logic here
  }
});

// And then, some where else
list.getAll(function (err, users) {
  // This made a GET request to http://somehost.com/users
  // It was sent with the custom header of "authorization"
  console.log(users);
});