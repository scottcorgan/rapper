var Rapper = require('rapper');

// Instantiate a new Rapper
var api = new Rapper({
  host: 'http://somehost.com'
});

// Create a new Endpoint with path: /users
var users =  api.resource('users', {
  customUserMethod: (callback) {
    // Custom logic here
  }
});

var user = users.one(123); // Creates endpoint with path /users/123

user.get().then(function (userData) {
  
});

user.remove().then(function (response) {
  // user removed
});

// BUT, what if we want the list of friends for this user?
// EASY!

// Generates endpoint wiht path /users/123/friends
var friends = user.resource('friends');

friends.list().then(function (allFriends) {
  
});