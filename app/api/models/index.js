var mongoose = require('mongoose');
var promise = require('bluebird');

promise.promisifyAll(mongoose);

exports.File = mongoose.model('File', require('./file'));
exports.Task = mongoose.model('Task', require('./task'));
exports.User = mongoose.model('User', require('./user'));
exports.List = mongoose.model('List', require('./list'));
