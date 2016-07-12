var express = require('express');
var router = express.Router();
var db = require('../models');
var QnUtil = require('./lib/qiniu');
var Auth = require('../services/auth.service.js');
var TaskService = require('../services/task.service.js');

module.exports = function (app) {
  app.use('/api/tasks', router);
};

var TaskHandler = {};

TaskHandler.getTasklist = function (req, res, next) {

  var query = req.query;
  var user = req.user;

  query.user_id = user.id;

  TaskService.getList(query, {
    content: 0
  })
    .then(function (list) {
      res.status(200).json(list);
    })
    .catch(function (err) {
      res.status(500).json({
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
TaskHandler.createTask = function (req, res, next) {
  var param = req.body;
  var user = req.user;
  param.user_id = user.id;
  if (!param.title && !param.content) {
    return res.status(400).jsonp({
      code: 'NO_TITLE_OR_CONTENT'
    });
  }
  TaskService.create(param)
    .then(function (task) {
      console.log(task);
      res.status(200).json(task);
    })
    .catch(function (err) {
      res.status(500).json({
        message: err
      });
    });
};


/**
 * update task
 * @param req
 * @param res
 * @param next
 */
TaskHandler.updateTask = function (req, res, next) {
  var param = req.body;
  var _id = req.params.id;
  delete param.id;
  param.update_time = new Date();
  TaskService.update(_id, param)
    .then(function(task){
      res.status(200).json(task);
    });
};

/**
 * 删除task
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
TaskHandler.deleteTask = function(req, res, next) {
  var id = req.params.id;
  TaskService.delete({_id: id})
    .then(function(task){
      res.status(200).json(task);
    })
    .catch(function(err){
      res.status(500).json(err);
    });
};

/**
 * 通过id获取task
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
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

TaskHandler.getCategories = function(req, res, next){

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
