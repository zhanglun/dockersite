
var db = require('../app/models');
var API = {};

API.Todo = {};
API.Todo.getList = function(req, res, next){
    var param = req.params;
    res.send(db.Todo.save);
};

/**
 * 创建 task
 * @param req
 * @param res
 * @param next
 */
API.Todo.create = function(req, res, next){
    var param = req.body;
    var task = new db.Todo(param);
    console.log(task.save);
    task.save(function(err, reply){
        if(err){
           res.status(400).json({
               message: err.message,
               code: err
           })
        }
        res.status(200).json(reply);
    });
};



module.exports = API;
