var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../../../config/config.js');

var router = express.Router();
var db = require('../models');
var Auth = require('../services/auth.js');

module.exports = function (app) {
  app.use('/api/user', router);
};



var UserHandler = {};

/**
 * authenticate user
 * @param uid
 */
UserHandler.autheniticate = function (uid) {

};

/**
 * 获取用户信息
 */
router.get('/:id', Auth.verifyToken, function (req, res) {

  var param = req.params;
  db.User.findOne({_id: param.id},{salt: false, password: false, token: false}, function(err, user){
    if(err){
      throw err;
    }
    if(!user){
      res.send('no user');
    }
    if(user){
      res.send(user);
    }
  });

});

/**
 * 登录
 */
router.post('/login', function (req, res) {
  var body = req.body;
  var query = {};
  if(body.email){
    query.email = body.email;
  }
  if(body.username){
    query.username = body.username;
  }
   db.User.findOne(query, function (err, user) {
    if (err) {
      res.status(500).json(err);
    }
    if (!user || !user.validPassword(body.password)) {
        return res.status(401).json({
        code: '40001',
        resource: {
          message: 'Wrong user or password!!'
        }
      });
    }


    var token = jwt.sign(user, config.secert, {
        expiresIn: 1440 * 60
      });
      var result = {
        user: {
          email: user
        },
        token: token
      };

      req.session.logined = true;
      req.session.user = {
        id: user._id,
        token: token
      };
      req.cookies.token = token;
      res.status(200).json(result);

   });

});

/**
 * 注册
 */
router.post('/signup', function (req, res) {
  var password = req.body.password;
  var email = req.body.email;
  if (password && email) {
    db.User.findOne({email: email}, function (err, user) {
      if (err) {
        res.status(500).json(err);
      } else if (user) {
        res.status(400).json({
          code: '40001',
          resource: {
            message: 'user is existed!'
          }
        });
      } else {
        var _user = {
          email: email,
          username: email
        };
        var newUser = new db.User(_user);
        newUser.makePasswordSalt(password);
        newUser.save(function (err, user) {
          var token = jwt.sign(user, config.secert, {
            expiresIn: 1440 * 60
          });
          console.log(res.cookie);
          res.cookie('token', token);
          res.status(200).json({
            email: user.email,
            name: user.username
          });
        });
      }
    });

  }

});

/**
 * 注销
 */
router.post('/logout', function(req, res){
  req.session.user = null;
  res.send('ok');
});

/**
 * 用户认证
 */
router.post('/authenticate', function (req, res) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secert, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message:  err.message
        });
      } else {
        console.log(decoded);
        var user_data = {
          username: decoded._doc.username,
          email: decoded._doc.email,
          id: decoded._doc._id
        };
        return res.json({
          success: true,
          message: 'Successed to authenticate token.',
          user: user_data
        });
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'no token'
    });
  }

});
