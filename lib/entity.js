var extend = require('lodash.assign');
var _http = require('./http');
var entity = {};

extend(entity, _http ,{
  key: 'value'
});

module.exports = entity;