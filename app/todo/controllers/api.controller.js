var express = require('express');
var router = express.Router();
var db = require('../models');

module.exports = function (app) {
  console.log('todo api');
  app.use('/api/todo', router);
};







var todoHandler = {};
todoHandler.getTasklist = function (req, res, next) {
  var querystring = req.query;
  console.log(querystring);
  db.Todo.find(querystring, function (err, list) {
    if (err) {
      return res.status(400).json({
        message: err.message,
        code: err
      });
    }
    return res.status(200).json(list);
  });
};

/**
 * 创建 task
 * @param req
 * @param res
 * @param next
 */
todoHandler.createTask = function (req, res, next) {
  var param = req.body;
  var task = new db.Todo(param);
  task.save(function (err, reply) {
    if (err) {
      return res.status(400).json({
        message: err.message,
        code: err
      });
    }
    return res.status(200).json(reply);
  });
};


/**
 * update task
 * @param req
 * @param res
 * @param next
 */
todoHandler.updateTask = function (req, res, next) {
  var param = req.body;
  var _id = req.params.id;
  console.log(_id);
  if (param._id !== _id) {
    return res.status(400).json({
      message: 'task id is not correct',
      code: 400
    });
  }
  //delete param._id;
  db.Todo.update({
    _id: _id
  }, {
    $set: param
  }, function (err, reply) {
    if (err) {
      console.log(err);
      res.status(400).json({
        message: err.message,
        code: err
      });
    }
    res.status(200).json(reply);
  });
};


todoHandler.deleteTask = function (req, res, next) {
  var _id = req.params.id;
  if (!_id) {
    return res.status(400).json({
      message: 'task id is not correct',
      code: 400
    });
  }
  db.Todo.findByIdAndRemove(_id, function (err, reply) {

    if (err) {
      console.log(err);
      res.status(400).json({
        message: err.message,
        code: err
      });
    }
    res.status(200).json(reply);
  });
};


todoHandler.getTaskById = function (req, res, next) {
  var id = req.params.id;
  db.Todo.find({
    id: id
  }, function (err, task) {
    if (err) {
      res.status(400).json({
        message: err.message,
        code: err
      });
    }
    res.status(200).json(task);
  });
};


todoHandler.getArchivedTasks = function (req, res, next) {
  db.Todo.find({category: 'archive'}, function (err, tasks) {
    console.log(tasks);
    if (err) {
      res.status(400).json({
        message: err.message,
        code: err
      });
    }
    res.status(200).json(tasks);
  });
};




// task list
router.get('/tasks', todoHandler.getTasklist);

// 创建 task
router.post('/tasks', todoHandler.createTask);
// 获得单个 task
router.get('/tasks/:id', todoHandler.getTaskById);
// 更新 task
router.put('/tasks/:id', todoHandler.updateTask);
// 删除 task
router.delete('/tasks/:id', todoHandler.deleteTask);

router.get('/archived', todoHandler.getArchivedTasks);

