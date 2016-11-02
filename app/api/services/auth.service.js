var db = require('../models');
var jwt  = require('jsonwebtoken');
var config = require('../../../config/config.js');
var gravatar = require('gravatar');


function verifyToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log('verifyToken start');
  if (token) {
    jwt.verify(token, config.secert, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        var user = {
          id: decoded._doc._id,
          email: decoded._doc.email,
          username: decoded._doc.username,
          avatar: gravatar.url(decoded._doc.email, {protocol: 'http', s: '100'})
        };
        req.user = user;
        console.log('verify token success');
        next();
      }
    });
  } else {

    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
}


module.exports = {
  verifyToken: verifyToken
};
