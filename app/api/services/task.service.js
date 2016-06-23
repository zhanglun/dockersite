var db = require('../models');
var Moment = require('moment');
var UtilTool = require('../util/tool');
var listService = require('./list.service.js');

var task = {};

function convertObjectIdToId(target) {
  if (Array.isArray(target)) {
    target = target.map(function(item) {
      item = item.toObject();
      item.id = item._id;
      if(item.update_time){
        item.update_time = Moment(item.update_time).format('YYYY-MM-DD HH:mm:ss');
      }
      if(item.create_time){
        item.create_time = Moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
      }
      delete item._id;
      delete item.__v;
      return item;
    });
  } else {
    target = target.toObject();
    target.id = target._id;
    if(target.update_time){
      target.update_time = Moment(target.update_time).format('YYYY-MM-DD HH:mm:ss');
    }
    if(target.create_time){
      target.create_time = Moment(target.create_time).format('YYYY-MM-DD HH:mm:ss');
    }
    delete target._id;
    delete target.__v;
  }
  return target;
}

task.getList = function(query, field, options) {
  // var _sort = query.completed ? {
  //   update_time: -1
  // } : {
  //   create_time: -1
  // };
  console.log(_sort);
  var _sort = {create_time: -1};
  return db.Task
    .find(query, field)
    .sort(_sort)
    .execAsync()
    .then(function(res) {
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

task.create = function(param) {
  var task = new db.Task(param);
  return task.saveAsync()
    .then(function(task) {
      task = UtilTool.convertObjectIdToId(task);
      listService.updateTotal(1);
      return task;
    })
    .catch(function(err) {
      console.log('err', err);
      return err;
    });
};

task.update = function(id, param) {
  return db.Task.updateAsync({
      _id: id
    }, {
      $set: param
    })
    .then(function(task) {
      return task;
    });
};

task.delete = function(query) {
  return db.Task.findOneAndRemoveAsync(query)
    .then(function(task) {
      return task;
    })
    .catch(function(err) {
      return err;
    });
};

module.exports = task;
