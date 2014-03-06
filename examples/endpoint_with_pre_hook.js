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

users.before(function (next) {
  // some logic here
  next();
});

// And then, some where else
users.list().then(function (users) {
  // This will have been called after the pre hook executed
  console.log(users);
});