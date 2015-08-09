var db = require('../app/models');
var API = {};

API.Todo = {};
API.Todo.getTasklist = function (req, res, next) {
    var querystring = req.query;
    //console.log(db.Todo.collection.find);
    db.Todo.find({}, function (err, list) {
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
    console.log(task.save);
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

API.Todo.getTaskById = function (req, res, next) {
    var id = req.params.id;
    db.Todo.find({id: id}, function(err, task){
        if (err) {
            res.status(400).json({
                message: err.message,
                code: err
            });
        }
        res.status(200).json(task);
    });
};

module.exports = API;
