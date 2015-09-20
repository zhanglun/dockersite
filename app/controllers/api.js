var express = require('express');
var router = express.Router();

var _API = require('../../middlewares').API;


module.exports = function (app) {
    app.use('/api', router);
};


// task list
router.get('/todo/tasks', _API.Todo.getTasklist);

// 创建 task
router.post('/todo/tasks', _API.Todo.createTask);
// 获得单个 task
router.get('/todo/tasks/:id', _API.Todo.getTaskById);
// 更新 task
router.put('/todo/tasks/:id', _API.Todo.updateTask);
// 删除 task
router.delete('/todo/tasks/:id', _API.Todo.deleteTask);


router.post('/files', _API.File.upload);

