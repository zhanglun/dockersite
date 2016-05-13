var db = require('../models');
var jwt  = require('jsonwebtoken');
var config = require('../../../config/config.js');


function verifyToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secert, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.user = decoded._doc;
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
