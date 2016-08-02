var db = require('../models');
var config = require('../../../config/config.js');


module.exports.getList = function(query){
  return db.Movie.findAsync(query)
    .then(function(movies){
      return movies;
    });
};