var express = require('express');
var router = express.Router();
var db = require('../models');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var auth = require('../services/auth');

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log(username);
    console.log(password);
    db.User.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      console.log(user.validPassword(password));
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {//保存user对象
  done(null, user);//可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) {//删除user对象
  done(null, user);//可以通过数据库方式操作
});

module.exports = function (app) {
  app.use('/api/user', router);
};


var UserHandler = {};


/**
 * 获取用户信息
 */
UserHandler.getUserDetail = function (uid) {

};

/**
 * authenticate user
 * @param uid
 */
UserHandler.autheniticate = function (uid) {

};

router.get('/:username', function (req, res) {

  var param = req.params; // {username: /:username}
  var data = req.body;
  res.status(200).json(param);
});


router.post('/authenticate', function (req, res) {
  console.log('user authenticate');
  res.send(200).json({
    param: req.param,
    data: req.body
  })
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.status(200).json({
    code: 20000,
    resource: {
      message: 'login 成功'
    }
  });
});

router.post('/signup', function (req, res) {
  console.log(req.body);
  var password = req.body.password;
  var username = req.body.username;
  if(password && username){
    db.User.findOne({username: username},function(err, user){
      if(err){
        res.status(500).json(err);
      } else if(user){
        res.status(400).json({
          code: '40001',
          resource: {
            message: 'user is existed!'
          }
        });
      }else{
        var _user = {
          username: username
        };
        var newUser = new db.User(_user);
        newUser.makePasswordSalt(password);
        newUser.save(function(err, user){
          console.log(arguments);
          res.status(200).json(user);
        });
      }
    });

  }

});
