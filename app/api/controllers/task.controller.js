var express = require('express');
var router = express.Router();
var db = require('../models');
var QnUtil = require('./lib/qiniu');
var Auth = require('../services/auth.service.js');
var TaskService = require('../services/task.service.js');

module.exports = function(app) {
  app.use('/api/tasks', router);
};



var TaskHandler = {};

TaskHandler.getTasklist = function(req, res, next) {

  var query = req.query;
  var user = req.user;

  query.user_id = user._id;

  TaskService.getList(query, {
      content: 0
    })
    .then(function(list) {
      console.log(list);
      res.status(200).json(list);
    })
    .catch(function(err) {
      res.status(400).json({
        message: err
      });
    });
};

/**
 * 创建 task
 * @param req
 * @param res
 * @param next
 */
TaskHandler.createTask = function(req, res, next) {
  var param = req.body;
  var user = req.user;
  param.user_id = user._id;
  if (!param.title && !param.content) {
    return res.status(400).jsonp({
      code: 'NO_TITLE_OR_CONTENT'
    });
  }

  var task = new db.Task(param);
  task.save(function(err, reply) {
    if (err) {
      res.status(400).json({
        message: err.message,
        code: err
      });
    }
    reply = reply.toObject();
    reply.id = reply._id;
    delete reply._id;
    res.status(200).json(reply);
  });
};


/**
 * update task
 * @param req
 * @param res
 * @param next
 */
TaskHandler.updateTask = function(req, res, next) {
  var param = req.body;
  var _id = req.params.id;
  delete param._id;
  db.Task.update({
    _id: _id
  }, {
    $set: param
  }, function(err, reply) {
    if (err) {
      console.log(err);
      res.status(400).jsonp({
        message: err.message,
        code: err
      });
    }
    res.status(200).jsonp(reply);
  });
};


TaskHandler.deleteTask = function(req, res, next) {
  var id = req.params.id;
  // console.log(req.params);
  // if (!_id) {
  //   return res.status(400).jsonp({
  //     message: 'task id is not correct',
  //     code: 400
  //   });
  // }
  // db.Task.findByIdAndRemove(_id, function(err, task) {

  //   if (err) {
  //     console.log(err);
  //     res.status(400).jsonp({
  //       message: err.message,
  //       code: err
  //     });
  //   }
  //   if (task.attachments.length > 0) {
  //     var _pathlist = task.attachments.map(function(item, i) {
  //       return item.name;
  //     });
  //     // QnUtil.deleteFile(_pathlist)
  //     //   .then(function(){

  //     //   });
  //   }
  //   res.status(200).jsonp(task);
  // });
  TaskService.delete({_id: id})
    .then(function(task){
      res.status(200).json(task);
    })
    .catch(function(err){
      res.status(500).json(err);
    });
};

TaskHandler.getTaskById = function(req, res, next) {
  var id = req.params.id;
  TaskService.get({
      _id: id
    })
    .then(function(task) {
      return res.status(200).json(task);
    })
    .catch(function(err) {
      res.status(500).json({
        message: err.message
      });
    });
};


TaskHandler.getArchivedTasks = function(req, res, next) {
  db.Task.find({
    category: 'archive'
  }, function(err, tasks) {
    console.log(tasks);
    if (err) {
      res.status(400).jsonp({
        message: err.message,
        code: err
      });
    }
    res.status(200).jsonp(tasks);
  });
};


// =======================================================================//
// Routers                                                                //
// =======================================================================//

// task list
router.get('/', Auth.verifyToken, TaskHandler.getTasklist);

// 创建 task
router.post('/', Auth.verifyToken, TaskHandler.createTask);
// 获得单个 task
router.get('/:id', TaskHandler.getTaskById);
// 更新 task
router.put('/:id', TaskHandler.updateTask);
// 删除 task
router.delete('/:id', TaskHandler.deleteTask);

router.get('/archived', TaskHandler.getArchivedTasks);
