var db = require('../models');
var UtilTool = require('../util/tool');

var category = {};

category.getList = function(userid) {
  return new Promise(function(resolve, reject) {
    db.List.find({}, function(err, lists) {
      if (err) {
        reject(err);
      } else {
        lists = UtilTool.convertObjectIdToId(lists);
        resolve(lists);
      }
    });
  });
};

category.get = function(categoryid) {
  return new Promise(function(resolve, reject) {
    db.List.findOne({
      _id: categoryid
    }, function(err, list) {
      if (err) {
        reject(err);
      } else {
        list = UtilTool.convertObjectIdToId(list);
        resolve(list);
      }
    });
  });
};

category.create = function(param) {
  return new Promise(function(resolve, reject) {
    var category = new db.List(param);
    category.save(function(err, list) {
      if (err) {
        reject(err);
      } else {
        list = UtilTool.convertObjectIdToId(list);
        resolve(list);
      }
    });
  });
};

category.update = function(categoryid, param) {
  console.log(arguments);
  var _update = {};
  param.name ? _update.name = param.name : null;
  return new Promise(function(resolve, reject) {
    db.List.findOneAndUpdate({
      _id: categoryid
    }, {
      $set: _update
    }, {
      new: true
    }, function(err, list) {
      console.log(arguments);
      if (err) {
        reject(err);
      } else {
        list = UtilTool.convertObjectIdToId(list);
        resolve(list);
      }
    });
  });
};

category.remove = function(categoryid) {
  return new Promise(function(resolve, reject) {
    db.List.remove({
      _id: categoryid
    }, function(err, reply) {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};

/**
 * test
 * @param  {[type]} id    [description]
 * @param  {[type]} count [description]
 * @return {[type]}       [description]
 */
category.initTotalTaskCount = function(id, count){
  return new Promise(function(resolve, reject){
    var promise = db.List.findById(id);
    promise.then(function(list){
      db.Task.find({list_id: id}).exec()
        .then(function(tasks){
          var task_completed = 0;
          var task_total = 0;
          task_total = tasks.length;
          tasks.map(function(item){
            if(item.completed){
              task_completed += 1;
            }
          });
          list.task_count_completed = task_completed;
          list.task_count_total = task_total;
          list.save(function(){
            console.log(arguments);
          });
        });
    });

  });
};

category.initTotalTaskCount('575438ddcb9036a0c0fcf801');

module.exports = category;
