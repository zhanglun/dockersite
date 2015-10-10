var express = require('express');
var router = express.Router();

var _API = require('./api.js');


module.exports = function (app) {
    app.use('/api/todo', router);
};


// task list
router.get('/tasks', _API.Todo.getTasklist);

// 创建 task
router.post('/tasks', _API.Todo.createTask);
// 获得单个 task
router.get('/tasks/:id', _API.Todo.getTaskById);
// 更新 task
router.put('/tasks/:id', _API.Todo.updateTask);
// 删除 task
router.delete('/tasks/:id', _API.Todo.deleteTask);

router.get('/archived', _API.Todo.getArchivedTasks);




/**
 * 博客 接口
 */
router.get('/blog/posts', function(req, res, next) {
  console.log(1111);
  db.Article.find({}, function(err, reply) {
    console.log(reply);
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(reply);
      res.send(reply);
    }
  });

});


router.post('/blog/posts', function(req, res, next) {
  console.log('post');
  var data = req.body;
  console.log(data);
  var post = db.Article(data);
  post.save(function(err, reply) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(reply);
      res.send(reply);
    }
  });

});
