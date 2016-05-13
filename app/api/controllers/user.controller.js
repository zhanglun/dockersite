var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../../../config/config.js');

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
  res.status(200).json({
    user: req.user
  });
});

/**
 * 获取用户信息
 */
router.get('/:id', Auth.verifyToken, function(req, res) {
  console.log('what the fuck!!!');
  var param = req.params;
  db.User.findOne({ _id: param.id }, { salt: false, password: false, token: false }, function(err, user) {
    if (err) {
      console.log(err);
      // throw err;
    }
    if (!user) {
      res.send('no user');
    }
    if (user) {
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
          username: email
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
