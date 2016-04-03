var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

exports.File = mongoose.model('File', require('./file'));
exports.Task = mongoose.model('Task', require('./task'));
exports.User = mongoose.model('User', require('./user'));
