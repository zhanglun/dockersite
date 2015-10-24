var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var mongoose = require('mongoose');
var redis = require('redis');

var app = express();

/**
 * 环境变量
 */
var PORT;
var db;

if (process.env.MONGODB_PORT_27017_TCP_PORT) {
  PORT = 80;
  app.enable('view cacahe');

  // mongodb
  var port = process.env.MONGODB_PORT_27017_TCP_PORT;
  var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
  var instance = process.env.MONGODB_INSTANCE_NAME;
  var password = process.env.MONGODB_PASSWORD;
  var username = process.env.MONGODB_USERNAME;
  mongoose.connect('mongodb://' + username + ':' + password + '@' + addr + ':' + port + '/' + instance);
  db = mongoose.connection;

} else {
  // mongodb
  PORT = 1234;
  mongoose.connect('mongodb://localhost/sitedev');
  db = mongoose.connection;

}

var redisClient = redis.createClient(config.redis.port, config.redis.host);

if (process.env.MONGODB_PORT_27017_TCP_PORT) {
  redisClient.auth(config.redis.password, function () {
    console.log('auth redis');
    console.log(arguments);
  });
}
redisClient.on('connect', function () {
  console.log('redis connected!');
});
redisClient.on('error', function () {
  console.log('redis connect error!!');
  console.log(arguments);
});
db.on('error', function (err) {
  console.log('database connection failed!: ' + err);
});

db.on('open', function () {
  console.log('database opened!!');
});


require('./config/express')(app, config);


// socket
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketCon = require('./middlewares/chat/connection.js')(io);
http.listen(PORT, function () {
  console.log('The server is listening on: ' + PORT);
});
