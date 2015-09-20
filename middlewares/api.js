var db = require('../app/models');
var API = {};

API.Todo = {};
API.Todo.getTasklist = function (req, res, next) {
  var querystring = req.query;
  console.log(querystring);
  db.Todo.find(querystring, function (err, list) {
    if (err) {
      res.status(400).json({
        message: err.message,
        code: err
      });
    }
    res.status(200).json(list);
  });
};

/**
 * 创建 task
 * @param req
 * @param res
 * @param next
 */
API.Todo.createTask = function (req, res, next) {
  var param = req.body;
  var task = new db.Todo(param);
  task.save(function (err, reply) {
    if (err) {
      res.status(400).json({
        message: err.message,
        code: err
      });
    }
    res.status(200).json(reply);
  });
};


/**
 * update task
 * @param req
 * @param res
 * @param next
 */
API.Todo.updateTask = function (req, res, next) {
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
        message: err.emssage,
        code: err
      });
    }
    res.status(200).json(reply);
  });
};


API.Todo.deleteTask = function (req, res, next) {
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
        message: err.emssage,
        code: err
      });
    }
    res.status(200).json(reply);
  });
};


API.Todo.getTaskById = function (req, res, next) {
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


API.Todo.getArchivedTasks = function (req, res, next) {
  console.log(';111');
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



API.File = {};


API.File.upload = function(){
  res.status(200).json({
    code: 200
  });
};


module.exports = API;
