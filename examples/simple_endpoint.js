var Narrator = require('narrator');

// Instantiate a new Narrator
var api = new Narrator({
  host: 'http://somehost.com'
});

// Create a new Endpoint
var users =  api.endpoint('users', {
  customUserMethod: (callback) {
    // Custom logic here
  }
});

// And then, some where else
users.list(function (err, users) {
  console.log(users);
});

users.create({name: 'frank'}, function (err, response) {
  // user created
});