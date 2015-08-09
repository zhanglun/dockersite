var express = require('express');
var router = express.Router();

var _API = require('../../middlewares').API;


module.exports = function (app) {
    app.use('/api', router);
};

router.get('/todo/tasklist', _API.Todo.getTasklist);
router.get('/todo/task/:id', _API.Todo.getTaskById);

// 创建新的 task
router.post('/todo/task/', _API.Todo.createTask);

