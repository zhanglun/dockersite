/**
 * Created by zhanglun on 8/1/15.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var Article = new Schema({
    title: String,
    content: String,
    author: String,
    ctime: {type: Date, default: Date.now},
    utime: {type: Date, default: Date.now},
    category: String,
    tags: []
});

/**
 * static
 */


exports.Article = mongoose.model('Article', Article);

