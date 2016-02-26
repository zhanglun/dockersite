var db = require('../models');
var jwt  = require('jsonwebtoken');
var config = require('../../../config/config.js');

function verifyToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log('----> token!!!');
  console.log(token);
  if (token) {
    jwt.verify(token, config.secert, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        console.log('===> decoded next()');
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
}


module.exports = {
  verifyToken: verifyToken
};
