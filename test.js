var Narrator = require('./lib/narrator');

var api = new Narrator({
  host: 'http://api.dev.divshot.com:9393'
});

var users = api.endpoint('users', {
  customMethod: function () {}
});

console.log(users.url());