/**
 * Created by zhanglun on 8/1/15.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var Article = new Schema({
  title: String,
  content: String,
  digest: String,
  author: String,
  create_time: {type: Date, default: Date.now},
  update_time: {type: Date, default: Date.now},
  category: String,
  tags: []
});

module.exports = Article;

