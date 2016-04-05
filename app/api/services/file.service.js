var db = require('../models');

var file = {};

file.get = function(query){
  return db.File.findAsync(query)
    .then(function(files){
      return files;
    })
    .catch(function(err){
      return  err;
    });
};

file.add = function(param){
  var file = new db.File(param);
  return file.saveAsync()
    .then(function(file){
      return file;
    });
};

module.exports = file;
