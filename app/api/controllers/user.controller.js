var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../../../config/config.js');
var gravatar = require('gravatar');

var router = express.Router();
var db = require('../models');
var Auth = require('../services/auth.service.js');

module.exports = function(app) {
  app.use('/api/user', router);
};

/**
 * 用户认证
 */
router.get('/authenticate', Auth.verifyToken, function(req, res) {
  res.status(200).json(req.user);
});

/**
 * 获取用户信息
 */
router.get('/:id', Auth.verifyToken, function(req, res) {
  var param = req.params;
  console.log(param);
  db.User.findOne({ _id: param.id }, {_id: 1, email: 1, username: 1, avatar: 1}, function(err, user) {
    if (!user) {
      res.status(200).json({
        messager: 'no user'
      });
    }
    if (user) {
      user = user.toObject();
      user.id = user._id;
      user.avatar = gravatar.url(user.email, {protocol: 'http', s: '100'});
      delete user._id;
      res.send(user);
    }
  });
});

/**
 * 登录
 */
router.post('/login', function(req, res) {
  var body = req.body;
  var query = {};
  if (body.email) {
    query.email = body.email;
  }
  if (body.username) {
    query.username = body.username;
  }
  db.User.findOne(query, function(err, user) {
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
    var result =  user;
    result.token = token;

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
router.post('/signup', function(req, res) {
  var password = req.body.password;
  var email = req.body.email;
  if (password && email) {
    db.User.findOne({ email: email }, function(err, user) {
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
          username: email,
          avatar: gravatar.url(email, {protocol: 'http', s: '100'}),
        };

        var newUser = new db.User(_user);
        newUser.makePasswordSalt(password);

        newUser.save(function(err, user) {
          var token = jwt.sign(user, config.secert, {
            expiresIn: 1440 * 60
          });
          res.status(200).json({
            user: {
              email: user.email,
              name: user.username,
            },
            token: token
          });
        });
        // TODO: 用户注册时，自动创建一个 inbox 的 list
      }
    });

  }

});

/**
 * 注销
 */
router.post('/logout', function(req, res) {
  req.session.user = null;
  res.send('ok');
});
