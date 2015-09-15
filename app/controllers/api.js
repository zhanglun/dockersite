var express = require('express');
var router = express.Router();

var _API = require('../../middlewares').API;


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




