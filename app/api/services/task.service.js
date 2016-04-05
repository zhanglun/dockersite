var db = require('../models');
var Promise = require('bluebird');

var task = {};


task.getList = function(arguments) {
  return db.Task.findAsync(arguments[0], arguments[1])
    .then(function(res) {
      console.log('--->service');
      return res;
    })
    .catch(function(err) {
      return
    });
};

task.get = function(query) {
  db.Task.findOneAsync(query)
    .then(function(task) {
      return task;
    })
    .catch(function(err) {
      return err;
    });
};

task.create = function() {

};

module.exports = task;
