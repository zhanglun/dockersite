var db = require('../models');
var UtilTool = require('../../util/tool');

var category = {};

category.getList = function(userid) {
  return new Promise(function(resolve, reject) {
    db.List.find({user_id: userid}, function(err, lists) {
      if (err) {
        reject(err);
      } else {
        lists = UtilTool.convertObjectIdToId(lists);
        resolve(lists);
      }
    });
  });
};

category.get = function(categoryids) {
  return new Promise(function(resolve, reject) {
    db.List.find({
      _id: {
        $in: categoryids
      }
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
category.initTotalTaskCount = function(id) {
  var promise = db.List.findById(id);
  promise
    .then(function(list) {
      return list
    })
    .then(function(list) {
      return db.Task.find({
          list_id: id
        }).exec()
        .then(function(tasks) {
          var task_archived = 0;
          var task_total = 0;
          var task_istrash = 0;
          task_total = tasks.length;
          tasks.map(function(item) {
            if (item.archived) {
              task_archived += 1;
            }else if(item.istrash) {
              task_istrash += 1;
            }
          });
          list.task_count_archived = task_archived;
          list.task_count_istrash = task_istrash;
          list.task_count_total = task_total;
          list.save(function() {
            console.log(list);
            return list
          });
        });
    })
};

/**
 * [updateTotalCount description]
 * @param  {[type]} id    [description]
 * @param  {[type]} count [description]
 * @return {[type]}       [description]
 */
category.updateTaskCount = function(id, param) {
  var promise = db.List.findById(id);
  promise.then(function(list) {
    list.task_count_total += (param.total || 0);
    list.task_count_archived += (param.archived || 0);
    list.task_count_istrash += (param.istrash || 0);
    console.log(list);
    list.save();
  });
  return promise;
}


module.exports = category;
