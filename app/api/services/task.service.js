var db = require('../models');
var Moment = require('moment');
var UtilTool = require('../../util/tool');
var listService = require('./list.service.js');

var task = {};

task.getList = function(query, field, options) {
  var _sort = {};
  var param = Object.assign({}, query);
  if (query.sort) {
    if (query.sort.indexOf('-') == 0) {
      _sort[query.sort.slice(1)] = -1;
    } else {
      _sort[query.sort] = 1;
    }
    delete param.sort;
  }
  var listIdArr = [];
  return db.Task
    .find(param, field)
    .sort(_sort)
    .execAsync()
    .then(function(res) {
      res = UtilTool.convertObjectIdToId(res);
      return res;
    })
    .then(function(res) {
      return res;
    })
    .then(function(tasks) {
      var collections = [];
      if (param.list_id) {
        listService.initTotalTaskCount(query.list_id);
        return tasks;
      }
      var flags = {};
      tasks.map(function(item) {
        if (flags[item.list_id]) {
          return false;
        }
        listIdArr.push(item.list_id);
        flags[item.list_id] = 1;
      });
      return listService.get(listIdArr)
        .then(function(lists) {
          lists.map(function(list) {
            tasks.map(function(task) {
              if (list.id == task.list_id) {
                task.list_name = list.name;
              }
            });
          });
          return tasks;
        });
    })
    .then(function(result) {
      return result
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
  task.deadline = new Date(new Date().setHours(24, 0, 0, 0));
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
  // step 1: find
  // step 2: if is_in_trash == true => delete
  // step 3: if is_in_trash == false => set true
  var q = db.Task.findOne(query);
  return q.exec().then(function(task) {
    if (task && task.istrash) {
      return db.Task.remove(query).exec().then(function(task) {
        listService.updateTaskCount(task.list_id, {
          total: -1
        });
        task = UtilTool.convertObjectIdToId(task);
        return task;
      });
    } else {
      task.istrash = true;
      return task.saveAsync()
        .then(function(task) {
          listService.updateTaskCount(task.list_id, {
            total: -1
          });
          task = UtilTool.convertObjectIdToId(task);
          return task;
        });
    }
  });
};

module.exports = task;
