var express = require('express');
var router = express.Router();

var Auth = require('../services/auth.service.js');
var listService = require('../services/list.service.js');
var db = require('../models');

module.exports = function (app) {
  app.use('/api/lists', router);
};


router.get('/', Auth.verifyToken, function (req, res, next) {
  var user_id = req.user.id;
  listService.getList(user_id)
    .then(function (list) {
      res.status(200).json(list);
    });
});

router.get('/:id', Auth.verifyToken, function (req, res, next) {
  var categoryId = req.params.id;
  listService.get(categoryId)
    .then(function (list) {
      res.status(200).json(list);
    });
});

router.post('/', Auth.verifyToken, function (req, res, next) {
  var param = req.body;
  param.user_id = req.user.id;
  if (!param.name) {
    res.status(400).send({
      message: 'no name'
    });
  }
  listService.create(param)
    .then(function (list) {
      res.status(200).json(list);
    });
});

router.put('/:id', Auth.verifyToken, function (req, res, next) {
  var categoryId = req.params.id;
  var param = req.body;
  listService.update(categoryId, param)
    .then(function (list) {
      res.status(200).json(list);
    });
});

router.delete('/:id', Auth.verifyToken, function (req, res, next) {
  var categoryId = req.params.id;
  listService.remove(categoryId)
    .then(function (list) {
      res.status(200).json(list);
    });
});

