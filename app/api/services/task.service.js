var db = require('../models');
var Moment = require('moment');
var UtilTool = require('../util/tool');
var listService = require('./list.service.js');

var task = {};

task.getList = function(query, field, options) {
  // var _sort = query.completed ? {
  //   update_time: -1
  // } : {
  //   create_time: -1
  // };
  console.log(_sort);
  var _sort = {
    create_time: -1
  };
  return db.Task
    .find(query, field)
    .sort(_sort)
    .execAsync()
    .then(function(res) {
      res = UtilTool.convertObjectIdToId(res);
      return res;
    })
    .then(function(res) {
      listService.initTotalTaskCount(query.list_id);
      return res;
    })
    .catch(function(err) {
      return err;
    });
};

task.get = function(query) {
  return db.Task.findOneAsync(query)
    .then(function(task) {
      task = UtilTool.convertObjectIdToId(task);
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
      listService.updateTaskCount(task.list_id, {
        total: 1
      });
      return task;
    })
    .catch(function(err) {
      console.log('err', err);
      return err;
    });
};

task.update = function(id, param) {
  return new Promise(function(resolve, reject) {
    db.Task.findOneAndUpdate({
      _id: id
    }, {
      $set: param
    }, {
      new: true
    }, function(err, task) {
      if (err) {
        reject(err);
      } else {
        task = UtilTool.convertObjectIdToId(task);
        resolve(task);
      }
    });
  });
};

task.delete = function(query) {
  return db.Task.findOneAndRemoveAsync(query)
    .then(function(task) {
      listService.updateTaskCount(task.list_id, {
        total: -1
      });
      task = UtilTool.convertObjectIdToId(task);
      return task;
    })
    .catch(function(err) {
      return err;
    });
};

module.exports = task;
