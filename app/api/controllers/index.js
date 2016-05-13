var express = require('express');
var router = express.Router();
var Auth = require('../services/auth.service.js');

module.exports = function(app){
  app.use('/api', router);
};

router.get('/', function(req, res, next){
  res.send('Hello! The API is at http://localhost:' + '1234' + '/api');
});

/**
 * 用户认证
 */
router.get('/authenticate', Auth.verifyToken, function(req, res) {
  res.status(200).json({
    user: req.user
  });
});
