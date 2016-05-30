var express = require('express');
var router = express.Router();
var db = require('../models');

var Auth = require('../services/auth.service.js');
var categoriesService = require('../services/category.service.js');

module.exports = function(app){
  app.use('/api/categories',  router);
};


router.get('/', function(req, res, next){

});
