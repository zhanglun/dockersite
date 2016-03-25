var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var auth = require('../services/auth.service.js');

var User = new Schema({
  username: String,
  salt: String,
  email: String,
  password: String
});

/**
 * 实例方法 验证密码
 * @param val
 * @returns {boolean}
 */
User.methods.validPassword = function(val){

  var md5 = crypto.createHash('md5');
  md5.update(val + this.salt);

  return this.password == md5.digest('hex');
};

/**
 * 加盐加密
 */
User.methods.makePasswordSalt = function(password){

  var md5 = crypto.createHash('md5');

  var salt = crypto.randomBytes(256).toString('hex');

  md5.update(password + salt);

  this.salt = salt;
  this.password = md5.digest('hex');

};

module.exports = User;
