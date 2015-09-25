/**
 * Created by zhanglun on 8/1/15.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var TodoSchema = new Schema({
    title: String,
    ctime: {type: Date, default: Date.now},
    deadline:{type: Date, default: Date.now},
    utime: {type: Date, default: Date.now},
    category: '',
    isDone: {type: Boolean, default: false},
    isOverdue: {type: Boolean, default: false},
    lables: []
});

exports.Todo = mongoose.model('Todo', TodoSchema);

