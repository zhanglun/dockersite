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

module.exports = category;
