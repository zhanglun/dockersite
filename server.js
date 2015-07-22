var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');


var config = require('./config');

process.env.CODE_ENV = process.argv.slice(2)[0];

console.log(process.env.CODE_ENV);
// Constants
if (process.env.CODE_ENV == 'dev') {
    var PORT = 3000;
} else {
    var PORT = 80;
}

// App

var router = require('./router');

var app = express();

app.use('/', router.Index);
app.use('/todo', router.Todo);
app.use('/movie', router.Movie);




app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
