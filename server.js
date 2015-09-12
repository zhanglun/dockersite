var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var mongoose = require('mongoose');

var app = express();

/**
 * 环境变量
 */
var env = process.env.NODE_ENV || 'development';
var PORT;
var db;

if (env == 'development') {
    console.log('deveploment');
    PORT = 3000;
    mongoose.connect('mongodb://localhost/sitedev');
    db = mongoose.connection;
} else {
    PORT = 80;
    app.enable('view cacahe');

    // mongodb
    var port = process.env.MONGODB_PORT_27017_TCP_PORT;
    var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
    var instance = process.env.MONGODB_INSTANCE_NAME;
    var password = process.env.MONGODB_PASSWORD;
    var username = process.env.MONGODB_USERNAME;
    // 'mongodb://user:pass@localhost:port/database'
    mongoose.connect('mongodb://' + username + ':' + password + '@' + addr + ':' + port + '/' + instance);
    db = mongoose.connection;
}

db.on('error', function (err) {
    console.log('database connection failed!: ' + err);
});

db.on('open', function () {
    console.log('database opened!!');
});



require('./config/express')(app, config);

app.listen(PORT, function () {
    console.log('The server is listening on: ' + PORT);
});

