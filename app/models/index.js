var mongoose = require('mongoose');



exports.Movie = mongoose.model('Movie', require('./movie'));
exports.Todo = mongoose.model('Todo', require('./todo'));