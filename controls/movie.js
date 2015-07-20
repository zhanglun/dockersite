var db = require('../models');

var Movie = {};

Movie.find = function(params, callback){
	db.Movie.find(params, function(err){
		callback(arguments);
	});
};


Movie.save = function(params, callback){
	var model = new db.Movie(params);
	model.save(callback);
};

module.exports = Movie;