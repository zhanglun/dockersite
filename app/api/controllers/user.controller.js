var express = require('express');
var router = express.Router();
var db = require('../models');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


module.exports = function(app) {
  app.use('/api/user', router);
};


var UserHandler = {};


/**
 * 获取用户信息
 */
UserHandler.getUserDetail = function(uid) {

};

/**
 * authenticate user
 * @param uid
 */
UserHandler.autheniticate = function(uid) {

};
router.get('/:username', function(req, res) {

  var username = req.param('username'); // /:username

  var param = req.params; // {username: /:username}
  var data = req.body;
  res.status(200).json({
    name: username
  });
});



router.post('/authenticate', function(req, res) {
  console.log('user authenticate');
  res.send(200).json({
    param: req.param,
    data: req.body
  })
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/user/' + req.user.username);
});
