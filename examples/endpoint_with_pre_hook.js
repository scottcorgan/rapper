var Narrator = require('narrator');

// Instantiate a new Narrator
var api = new Narrator({
  host: 'http://somehost.com'
});

// Create a new Endpoint
var users =  api.endpoint('users', {
  hooks: {
    pre: function (next) { // <~~~~~ Pre hook all the things!
      // some logic here
      next();
    }
  }
  customUserMethod: (callback) {
    // Custom logic here
  }
});

// And then, some where else
users.list(function (err, users) {
  // This will have been called after the pre hook executed
  console.log(users);
});