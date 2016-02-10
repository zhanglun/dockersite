var db = require('../models');
var config = require('../../../config/config.js');

function verifyToken(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(token);
  if(token){
    jwt.verify(token, config.secert, function(err, decoded){
      if(err){
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      }else{
        console.log(decoded);
        next();
      }
    });
  }
}


module.exports = {
  verifyToken: verifyToken
};
