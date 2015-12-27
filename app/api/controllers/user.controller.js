var express = require('express');
var router = express.Router();
var db = require('../models');


module.exports = function(app){
  app.use('/api/user', router);
};


var UserHandler = {};


/**
 * 获取用户信息
 */
UserHandler.getUserDetail = function(uid){

};

/**
 * authenticate user
 * @param uid
 */
UserHandler.autheniticate= function(uid){

};
router.get('/:username', function(req, res){
  var param = req.param;
  var data = req.body;
  console.log(req);
});



router.post('/authenticate', function(req, res){
 console.log('user authenticate');
});
