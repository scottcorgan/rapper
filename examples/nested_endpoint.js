var Narrator = require('narrator');

// Instantiate a new Narrator
var api = new Narrator({
  host: 'http://somehost.com'
});

// Create a new Endpoint with path: /users
var users =  api.endpoint('users', {
  customUserMethod: (callback) {
    // Custom logic here
  }
});

var user = users.one(123); // Creates endpoint with path /users/123

user.get(function (err, userData) {
  
});

user.remove(function (err, response) {
  // user removed
});

// BUT, what if we want the list of friends for this user?
// EASY!

// Generates endpoint wiht path /users/123/friends
var friends = user.endpoint('friends');

friends.list(function (err, allFriends) {
  
});