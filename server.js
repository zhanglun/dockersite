var schedule = require('node-schedule');
var request = require('request');

var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var redis = require('redis');

var app = express();

/**
 * 环境变量
 */
var PORT;
var db;
var env;


if (process.env.MONGODB_PORT_27017_TCP_PORT) {
  PORT = 80;
  app.enable('view cacahe');
  env = 'production';
  // mongodb
  var port = process.env.MONGODB_PORT_27017_TCP_PORT;
  var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
  var instance = process.env.MONGODB_INSTANCE_NAME;
  var password = process.env.MONGODB_PASSWORD;
  var username = process.env.MONGODB_USERNAME;
  mongoose.connect('mongodb://' + username + ':' + password + '@' + addr + ':' + port + '/' + instance);
  db = mongoose.connection;

  var redisClient = redis.createClient(config.redis.port, config.redis.host);
  redisClient.auth(config.redis.password, function () {
  });

} else {
  env = 'development';
  PORT = config.port;

  mongoose.connect(config.mongodb.host);
  db = mongoose.connection;

}

// redisClient.on('connect', function () {
//   console.log('redis connected!');
// });

// redisClient.on('error', function () {
//   console.log('redis connect error!!');
//   console.log(arguments);
// });

db.on('error', function (err) {
  console.log('database connection failed!: ' + err);
});

db.on('open', function () {
  console.log('database opened!!');
});

require('./config/express')(app, config);
console.log('----app config----: env ' + env);

var http = require('http').Server(app);
http.listen(PORT, function () {
  console.log('The server is listening on: ' + PORT);
});


// 定时访问daocloud 避免免费版睡眠
var rule = new schedule.RecurrenceRule();
var times = [0, 30, 60];
rule.minute = times;
var j = schedule.scheduleJob(rule, function () {
  console.log('The answer to life, the universe, and everything!, %s', new Date());
  request.get('http://zhanglun.daoapp.io/');
});
