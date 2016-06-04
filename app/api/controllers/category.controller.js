var express = require('express');
var router = express.Router();
var db = require('../models');

var Auth = require('../services/auth.service.js');
var categoriesService = require('../services/category.service.js');

module.exports = function(app) {
  app.use('/api/categories', router);
};


router.get('/', function(req, res, next) {
  categoriesService.getList()
    .then(function(list) {
      res.status(200).json(list);
    })
    // .catch(function(err){
    //
    // });
});
router.get('/:id', function(req, res, next) {
  var categoryId = req.params.id;
  categoriesService.get(categoryId)
    .then(function(category) {
      res.status(200).json(category);
    })
    // .catch(function(err){
    //
    // });
});

router.post('/', function(req, res, next) {
  var param = req.body;
  if (!param.name) {
    res.status(400).send({
      message: 'no name'
    });
  }
  categoriesService.create(param)
    .then(function(category) {
      res.status(200).json(category);
    })
    // .catch(function(err){
    //   res.status(err.status).send({});
    // });
});

router.put('/:id', function(req, res, next){
  var categoryId = req.params.id;
  var param = req.body;
  categoriesService.update(categoryId, param)
    .then(function(category){
      res.status(200).json(category);
    });
});
