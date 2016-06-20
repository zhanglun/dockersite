var express = require( 'express' );
var router = express.Router();
var db = require('../models');

var Auth = require('../services/auth.service.js');
var listService = require('../services/list.service.js');

module.exports = function(app) {
  app.use('/api/lists', router);
};


router.get('/', function(req, res, next) {
  listService.getList()
    .then(function(list) {
      res.status(200).json(list);
    })
    // .catch(function(err){
    //
    // });
});
router.get('/:id', function(req, res, next) {
  var categoryId = req.params.id;
  listService.get(categoryId)
    .then(function(list) {
      res.status(200).json(list);
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
  listService.create(param)
    .then(function(list) {
      res.status(200).json(list);
    })
    // .catch(function(err){
    //   res.status(err.status).send({});
    // });
});

router.put('/:id', function(req, res, next){
  var categoryId = req.params.id;
  var param = req.body;
  console.log(param);
  console.log(categoryId);
  listService.update(categoryId, param)
    .then(function(list){
      res.status(200).json(list);
    });
});

router.delete('/:id', function(req, res, next){
  var categoryId = req.params.id;
  listService.remove(categoryId)
    .then(function(list){
      res.status(200).json(list);
    });
});
