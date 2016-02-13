var express = require('express');
var jwt = require('jsonwebtoken');
console.log(jwt);
var config = require('../../../config/config.js');

var router = express.Router();
var db = require('../models');
var Auth = require('../services/auth.js');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    db.User.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {//保存user对象
  done(null, user._id);//可以通过数据库方式操作
});
passport.deserializeUser(function (user, done) {//删除user对象
  done(null, user);//可以通过数据库方式操作
});

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
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      res.status(500).json(err);
    }
    if (!user) {
      res.status(401).json({
        code: '40001',
        resource: {
          message: 'no user'
        }
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return;
      }
      var token = jwt.sign(user, config.secert, {
        expiresIn: 1440 * 60
      });
      var result = {
        user: {
          name: user.username
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
  })(req, res);
});

/**
 * 注册
 */
router.post('/signup', function (req, res) {
  var password = req.body.password;
  var username = req.body.username;
  if (password && username) {
    db.User.findOne({username: username}, function (err, user) {
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
          username: username
        };
        var newUser = new db.User(_user);
        newUser.makePasswordSalt(password);
        newUser.save(function (err, user) {
          res.status(200).json(user);
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
router.post('/authenticate', Auth.verifyToken, function (req, res) {
  db.User.findOne({username: username}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return res.status(404).json({message: 'Incorrect username.'});
    }
    if (!user.validPassword(password)) {
      return res.status(401).json({message: 'Incorrect password.'});
    }
    return res.status(200).json({
      type: true,
      data: user,
      token: user.token
    });
  });
});
