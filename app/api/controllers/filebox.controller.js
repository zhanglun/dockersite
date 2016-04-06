var express = require('express');
var router = express.Router();
var db = require('../models');
var FileBoxService = require('../services/filebox.service.js');

module.exports = function(app) {
  app.use('/api/file', router);
};

router.get('/', function(req, res, next){
  FileBoxService.get()
    .then(function(files) {
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
  FileBoxService.get(query)
    .then(function(file) {
      res.status(200).json(files);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });

});


router.post('/', function(req, res, next) {
  var param = req.body;
  FileBoxService.add(param)
  .then(function(file){
    res.status(200).json(file);
  });
});

router.get('/a/deleteall', function(req, res, next){
  db.File.removeAsync({})
    .then(function(res){
    })
    .catch(function(err){
      console.log(err);
    });
  res.send('delete all');
});
