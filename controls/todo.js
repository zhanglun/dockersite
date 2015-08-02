/**
 * Created by zhanglun on 8/1/15.
 */


var db = require('../models');

var Todo = {};

Todo.find = function(params, callback){
    db.Todo.find(params, function(err, callback){

    });
};

module.exports = Todo;
