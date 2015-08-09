var express = require('express');
var config = require('./config/config');
var glob = require('glob');
var mongoose = require('mongoose');

var app = express();

/**
 * 环境变量
 */
var env = process.env.NODE_ENV;
var PORT;

if (env == 'development') {
    console.log('deveploment');
    PORT = 3000;
} else {
    PORT = 80;
    app.enable('view cacahe');
}


require('./config/express')(app, config);

app.listen(PORT, function () {
    console.log('The server is listening on: ' + PORT);
});

