var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({

  // parent_id: String,
  // children_id: [],

  create_time: {type: Date, default: Date.now},
  update_time: {type: Date, default: Date.now},

  // is_root: Boolean,
  name: String,
  task_count_total: {type: Number, default: 0},
  task_count_completed: {type: Number, default: 0},
  task_count_archived: {type: Number, default: 0},
  task_count_istrash: {type: Number, default: 0},

});

module.exports = CategorySchema;
