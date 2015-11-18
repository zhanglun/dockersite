var mongoose = require('mongoose');

exports.Todo = mongoose.model('Todo', require('./todo'));
