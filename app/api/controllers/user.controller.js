var express = require('express');
var router = express.Router();
var db = require('../models');

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

/**
 *
 */
router.get('/:username', function (req, res) {

  var param = req.params; // {username: /:username}
  res.status(200).json(param);
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
      req.session.userid = user._id;
      req.session.logined = true;
      var result = {
        name: user.username
      };
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


router.post('/authenticate', function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];


  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.status(403).json({success: false, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }

});
