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

  var username = req.param('username'); // /:username

  var param = req.params; // {username: /:username}
  var data = req.body;
  console.log(param);
  res.status(200).json({
    name: username
  });
});



router.post('/authenticate', function(req, res){
 console.log('user authenticate');
  res.send(200).json({
    param: req.param,
    data: req.body
  })
});
