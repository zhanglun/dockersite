var mongoose = require('mongoose');
var promise = require('bluebird');

promise.promisifyAll(mongoose);

exports.Movie = mongoose.model('Movie', require('./movie'));