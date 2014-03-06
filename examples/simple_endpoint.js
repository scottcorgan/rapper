var Rapper = require('rapper');

// Instantiate a new Rapper
var api = new Rapper({
  host: 'http://somehost.com'
});

// Create a new Endpoint
var users =  api.resource('users', {
  customUserMethod: (callback) {
    // Custom logic here
  }
});

// And then, some where else
users.list().then(function (users) {
  console.log(users);
});

users.create({name: 'frank'}).then(function (response) {
  // user created
});