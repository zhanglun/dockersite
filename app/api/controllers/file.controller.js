var express = require('express');
var router = express.Router();
var db = require('../models');
var FileService = require('../services/file.service.js');

module.exports = function(app) {
  app.use('/api/file', router);
};

router.get('/', function(req, res, next){
  FileService.get()
    .then(function(file) {
      res.status(200).json(files);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

router.get('/:id', function(req, res, next) {
  var id = req.param.id;
  var query = {};
  if(id){
    query = {
      _id: id
    };
  }
  FileService.get(query)
    .then(function(file) {
      res.status(200).json(files);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });

});


router.post('/', function(req, res, next) {
  var param = req.body;
  FileService.add(param)
  .then(function(file){
    res.status(200).json(file);
  });
});
