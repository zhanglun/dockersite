var mongoose = require('mongoose');

exports.File = mongoose.model('File', require('./file'));
exports.Task = mongoose.model('Task', require('./task'));
exports.User = mongoose.model('User', require('./user'));

