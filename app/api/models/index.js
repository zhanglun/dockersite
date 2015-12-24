var mongoose = require('mongoose');

exports.Task = mongoose.model('Task', require('./task'));
