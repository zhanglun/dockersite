var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = new Schema({

  name: String,
  user_id: String,
  create_time: {type: Date, default: Date.now},
  update_time: {type: Date, default: Date.now},

  task_count_total: {type: Number, default: 0},
  task_count_completed: {type: Number, default: 0},
  task_count_archived: {type: Number, default: 0},
  task_count_istrash: {type: Number, default: 0},

});

module.exports = ListSchema;
