var db = require('../models');

var task = {};

function convertObjectIdToId(target) {
  if (Array.isArray(target)) {
    target = target.map(function (item) {
      item = item.toObject();
      item.id = item._id;
      delete item._id;
      delete item.__v;
      return item;
    });
  } else {
    target = target.toObject();
    target.id = target._id;
    delete target._id;
    delete target.__v;
  }
  return target;
}

task.getList = function (query, field, options) {
  return db.Task
    .find(query, field)
    .sort({ update_time: -1 })
    .execAsync()
    .then(function (res) {
      res = convertObjectIdToId(res);
      return res;
    })
    .catch(function (err) {
      return err;
    });
};

task.get = function (query) {
  return db.Task.findOneAsync(query)
    .then(function (task) {
      task = convertObjectIdToId(task);
      return task;
    })
    .catch(function (err) {
      return err;
    });
};

task.create = function (param) {
  var task = new db.Task(param);
  return task.saveAsync()
    .spread(function (task) {
      task = task.toObject();
      task.id = task._id;
      return task;
    })
    .catch(function (err) {
      return err;
    });
};


task.delete = function (query) {
  return db.Task.findOneAndRemoveAsync(query)
    .then(function (task) {
      return task;
    })
    .catch(function (err) {
      return err;
    });
};

module.exports = task;
