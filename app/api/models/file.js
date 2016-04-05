var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({

  parent_id: String,
  children_id: [],

  create_time: {type: Date, default: Date.now},
  update_time: {type: Date, default: Date.now},

  isfile: Boolean,
  isroot: Boolean,

  name: String,
  path: String,
  size: String
});

module.exports = FileSchema;
