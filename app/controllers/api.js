var express = require('express');
var router = express.Router();

var _API = require('../../middlewares').API;


module.exports = function (app) {
    app.use('/api', router);
};

router.get('/todo/tasks/:id', _API.Todo.getTaskById);


router.get('/todo/tasks', _API.Todo.getTasklist);
// 创建新的 task
router.post('/todo/tasks/', _API.Todo.createTask);

router.put('/todo/tasks/:id', _API.Todo.updateTask);

