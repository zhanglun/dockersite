var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
  name: String,
  size: String,
  parent_id: String,
  children_id: [],
  create_time: {type: Date, default: Date.now},
  update_time: {type: Date, defauly: Date.now},
  type: String
});

module.exports = FileSchema;
