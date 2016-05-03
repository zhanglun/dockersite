var db = require('../models');
var Promise = require('bluebird');

var task = {};

function convertObjectIdToId(target){
  if(Array.isArray(target)){
    target = target.map(function(item){
      item = item.toObject();
      item.id = item._id;
      delete item._id;
      delete item.__v;
      return item
    });
  }else{
      target = target.toObject();
      target.id = target._id;
      delete target._id;
      delete target.__v;
  }
  return target;
};

task.getList = function(arguments) {
  return db.Task.findAsync(arguments[0], arguments[1])
    .then(function(res) {
      console.log(res);
      res = convertObjectIdToId(res);
      return res;
    })
    .catch(function(err) {
      return err;
    });
};

task.get = function(query) {
  return db.Task.findOneAsync(query)
    .then(function(task) {
      task = convertObjectIdToId(task);
      return task;
    })
    .catch(function(err) {
      return err;
    });
};


task.create = function() {

};


task.delete = function(query){
  return db.Task.findOneAndRemoveAsync(query)
    .then(function(task){
      return task;
    })
    .catch(function(err){
      return err;
    });
};

module.exports = task;
