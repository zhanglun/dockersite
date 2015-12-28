var mongoose = require('mongoose');

exports.Task = mongoose.model('Task', require('./task'));
exports.User = mongoose.model('User', require('./user'));
