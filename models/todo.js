/**
 * Created by zhanglun on 8/1/15.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var Todo = new Schema({
    name: String,
    ctime: {type: Date, default: Date.now},
    deadline:{type: Date, default: Date.now}
});

module.exports = Todo;