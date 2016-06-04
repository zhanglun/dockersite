var db = require('../models');
var Moment = require('moment');

var category = {};

category.getList = function(userid) {
  return new Promise(function(resolve, reject) {
    db.Category.find({}, function(err, list) {
      if (err) {
        reject(err);
      } else {
        resolve(list);
      }
    });
  });
  return db.Task.find({
    userid
  });
};

category.get = function(categoryid) {
  return new Promise(function(resolve, reject) {
    db.Category.find({
      _id: categoryid
    }, function(err, category) {
      if (err) {
        reject(err);
      } else {
        resolve(category);
      }
    });
  });
};

category.create = function(param) {
  return new Promise(function(resolve, reject) {
    var category = new db.Category(param);
    category.save(function(err, category) {
      if (err) {
        reject(err);
      } else {
        resolve(category);
      }
    });
  });
};

category.update = function(categoryid, param) {
  var _update = {};
  param.name ? _update.name = param.name : null;
  return new Promise(function(resolve, reject) {
    db.Category.findOneAndUpdate({
      _id: categoryid
    }, {
      $set: _update
    }, {
      new: true
    }, function(err, reply) {
      console.log(arguments);
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};

category.delete = function() {
  return new Promise();
};

module.exports = category;
