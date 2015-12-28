var express = require('express');
var router = express.Router();
var db = require('../models');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
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

/*
 Helper Functions
 */
function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);

  User.findOne({
      username: name
    },

    function (err, user) {
      if (user) {
        if (err) return fn(new Error('cannot find user'));
        hash(pass, user.salt, function (err, hash) {
          if (err) return fn(err);
          if (hash == user.hash) return fn(null, user);
          fn(new Error('invalid password'));
        });
      } else {
        return fn(new Error('cannot find user'));
      }
    });

}

function requiredAuthentication(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

function userExist(req, res, next) {
  User.count({
    username: req.body.username
  }, function (err, count) {
    if (count === 0) {
      next();
    } else {
      req.session.error = "User Exist";
      res.redirect("/signup");
    }
  });
}











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
  res.redirect('/user/' + req.user.username);
});

router.post('/signup', function (req, res) {
  var password = req.body.password;
  var username = req.body.username;
  res.status(200).json(req.body);

});
