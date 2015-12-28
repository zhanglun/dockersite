var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  salt: String,
  hash: String,
  email: String
});
module.exports = UserSchema;
