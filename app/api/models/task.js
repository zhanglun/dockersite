/**
 * Created by zhanglun on 8/1/15.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var TaskSchema = new Schema({
    title: String,
    content: String,
    user_id: String,
    create_time: {type: Date, default: Date.now},
    deadline:{type: Date, default: Date.now},
    update_time: {type: Date, default: Date.now},
    list_id: String,
    completed: {type: Boolean, default: false},
    isoverdue: {type: Boolean, default: false},
    lables: [],
    attachments: []
});

module.exports = TaskSchema;
