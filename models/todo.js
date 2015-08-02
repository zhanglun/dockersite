/**
 * Created by zhanglun on 8/1/15.
 */

var mongoose = require('mongoose');

var schema = mongoose.Schema;


var Todo = new Shcema({
    name: String,
    ctime: {type: Date, default: Date.now},
    deadline:{type: Date, default: Date.now}
});

module.exports = Todo;