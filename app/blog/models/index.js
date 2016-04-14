var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

exports.Article = mongoose.model('Article', require('./article'));
