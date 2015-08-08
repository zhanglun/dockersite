var express = require('express');
var router = express.Router();

var _API = require('../../middlewares').API;

console.log(_API);

module.exports = function (app) {
    app.use('/api', router);
};

router.get('/todo/list', _API.Todo.getList);
