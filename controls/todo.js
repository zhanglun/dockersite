/**
 * Created by zhanglun on 8/1/15.
 */


var db = require('../models');

var Todo = {};


/**
 * 查找 todo
 * @param params
 * @param callback
 */
Todo.find = function(params, callback){
    db.Todo.find(params, function(err, todo){
        if(err){

        }else{
            callback(todo);
        }
    });
};


Todo.create = function(params, callback){
    db.Todo.save(params, function(err, reply){
        if(err){

        }else{
            callback(reply);
        }
    });
};



module.exports = Todo;
