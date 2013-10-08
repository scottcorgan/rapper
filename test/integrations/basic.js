var Narrator = require('../../lib/narrator');
var stubServer = require('../stubs/server');
var api = new Narrator({
  host: stubServer.STUB_HOST
});

stubServer.server.start(function () {
  var users = api.endpoint('users');

  users.list(function (err, list) {
    console.log('LIST:', list);
  });
  
  users.create({name: 'me'}, function (err, response) {
    console.log('CREATE:', response);
  });
  
  var user = users.one(123);
  
  user.get(function (err, data) {
    console.log('GET:', data);
  });
  
  user.update({name: 'new'}, function (err, response) {
    console.log('UPDATE:', response);
  });
  
  user.remove(function (err, response) {
    console.log('REMOVE:', response);
  });
});
